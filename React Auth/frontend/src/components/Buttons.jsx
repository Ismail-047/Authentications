
export function ThemeButton({
    onClick,
    icon,
    btnLabel,
    isButtonLoading,
    isButtonDisabled,
    extraClasses,
    loadingLabel,
}) {
    return (
        <button type={`${!onClick ? "submit" : "button"}`} onClick={onClick}
            className={`flex items-center justify-center bg-gray-900 hover:ring-2 ring-blue-700 rounded-xl font-semibold h-[55px] text-white px-6 w-full disabled:opacity-70 disabled:ring-0 transition-all duration-300 ease-in-out disabled:cursor-not-allowed
             ${extraClasses}`}
            disabled={isButtonDisabled || isButtonLoading}
        >
            {isButtonLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{loadingLabel}</span>
                </div>
            ) : (
                <div className="flex justify-center items-center gap-2">
                    {icon && icon}
                    <span>{btnLabel}</span>
                </div>
            )}
        </button>
    )
}