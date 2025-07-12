export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center gap-x-2 cursor-pointer border-0 rounded-lg shadow-[rgba(0,0,0,0.2)_0_4px_12px] bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] transition-transform duration-300 hover:scale-105 active:scale-95 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${customClasses}`}
      type={type}
    >
      <span
        className={`flex items-center justify-center w-full h-full rounded-md px-6 py-3 text-white transition-colors duration-300 ${
          outline
            ? "bg-transparent border border-[#4a00e0] text-[#4a00e0] hover:bg-[#4a00e0] hover:text-white"
            : "hover:bg-gradient-to-r hover:from-[#4a00e0] hover:to-[#8e2de2]"
        }`}
      >
        {children ? (
          <>
            <span>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </span>
    </button>
  );
}
