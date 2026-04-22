import os
import re
import unicodedata
from pathlib import Path
from PIL import Image

# Ruta raíz donde tienes las carpetas por comunidad
ROOT_DIR = Path("./pois-destacados")

# Configuración de optimización
MAX_WIDTH = 1200
QUALITY = 80

VALID_INPUT_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}


def slugify_filename(value: str) -> str:
    value = value.strip().lower()
    value = unicodedata.normalize("NFD", value)
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    value = value.replace("&", " y ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value)
    value = value.strip("-")
    return value


def optimize_image(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        new_height = int(img.height * ratio)
        img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

    return img


def convert_file(image_path: Path) -> Path | None:
    if image_path.suffix.lower() not in VALID_INPUT_EXTENSIONS:
        return None

    stem_clean = slugify_filename(image_path.stem)
    if not stem_clean:
        print(f"⚠️ Nombre inválido, se omite: {image_path}")
        return None

    output_path = image_path.with_name(f"{stem_clean}.webp")

    try:
        with Image.open(image_path) as img:
            img = optimize_image(img)
            img.save(output_path, "WEBP", quality=QUALITY, optimize=True)

        # Si el archivo original no era ya el webp final, lo borramos
        if image_path.resolve() != output_path.resolve():
            image_path.unlink(missing_ok=True)

        print(f"✅ {image_path.name} -> {output_path.name}")
        return output_path

    except Exception as e:
        print(f"❌ Error procesando {image_path}: {e}")
        return None


def remove_non_webp_files(root_dir: Path) -> None:
    for path in root_dir.rglob("*"):
        if path.is_file() and path.suffix.lower() != ".webp":
            try:
                path.unlink()
                print(f"🧹 Eliminado no-webp: {path}")
            except Exception as e:
                print(f"⚠️ No se pudo eliminar {path}: {e}")


def deduplicate_webp_names(root_dir: Path) -> None:
    """
    Si dos archivos distintos acaban con el mismo nombre slug.webp dentro de la misma carpeta,
    conserva el primero y elimina duplicados posteriores.
    """
    for folder in [p for p in root_dir.rglob("*") if p.is_dir()]:
        seen = set()
        for file in sorted(folder.glob("*.webp")):
            key = file.name.lower()
            if key in seen:
                try:
                    file.unlink()
                    print(f"🧹 Duplicado eliminado: {file}")
                except Exception as e:
                    print(f"⚠️ No se pudo eliminar duplicado {file}: {e}")
            else:
                seen.add(key)


def process_directory(root_dir: Path) -> None:
    if not root_dir.exists():
        raise FileNotFoundError(f"No existe la carpeta raíz: {root_dir.resolve()}")

    for path in sorted(root_dir.rglob("*")):
        if path.is_file() and path.suffix.lower() in VALID_INPUT_EXTENSIONS:
            convert_file(path)

    remove_non_webp_files(root_dir)
    deduplicate_webp_names(root_dir)

    print("\n🔥 Conversión completada. Solo deberían quedar archivos .webp")


if __name__ == "__main__":
    process_directory(ROOT_DIR)