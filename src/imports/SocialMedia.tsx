import svgPaths from "./svg-irjqafk06h";

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute left-[17px] size-[36px] top-[15px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        {children}
      </svg>
    </div>
  );
}

export default function SocialMedia() {
  return (
    <div className="relative size-full" data-name="Social media">
      <div className="absolute bg-white border border-[#e8e8e8] border-solid h-[68px] left-0 rounded-[6px] top-0 w-[72px]" data-name="Signup">
        <Wrapper>
          <g clipPath="url(#clip0_1_186)" id="Logo/facebook 1">
            <path d={svgPaths.p33b08000} fill="var(--fill-0, #1877F2)" id="Vector" />
          </g>
          <defs>
            <clipPath id="clip0_1_186">
              <rect fill="white" height="36" width="36" />
            </clipPath>
          </defs>
        </Wrapper>
      </div>
      <div className="absolute bg-white border border-[#e8e8e8] border-solid h-[68px] left-[96px] rounded-[6px] top-0 w-[72px]" data-name="Signup">
        <div className="absolute left-[17px] overflow-clip size-[36px] top-[15px]" data-name="Logo/Google__G__Logo 1">
          <div className="absolute inset-[0_1.06%]" data-name="Group">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.235 36">
              <g id="Group">
                <path d={svgPaths.p1d79fa00} fill="var(--fill-0, #4285F4)" id="Vector" />
                <path d={svgPaths.p228de300} fill="var(--fill-0, #34A853)" id="Vector_2" />
                <path d={svgPaths.p11e0e700} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
                <path d={svgPaths.p3888c7c0} fill="var(--fill-0, #EA4335)" id="Vector_4" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bg-white border border-[#e8e8e8] border-solid h-[68px] left-[192px] rounded-[6px] top-0 w-[72px]" data-name="Signup">
        <Wrapper>
          <g clipPath="url(#clip0_1_177)" id="Logo/linkedin 1">
            <path d={svgPaths.p109b8300} fill="var(--fill-0, #0A66C2)" id="Vector" />
          </g>
          <defs>
            <clipPath id="clip0_1_177">
              <rect fill="white" height="36" width="36" />
            </clipPath>
          </defs>
        </Wrapper>
      </div>
    </div>
  );
}