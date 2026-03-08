type LogoProps = {
    size?: number;
    className?: string;
};

export default function Logo({ size = 32, className = "" }: LogoProps) {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Shield shape */}
                <path
                    d="M32 4L8 16v16c0 14.4 10.24 27.84 24 32 13.76-4.16 24-17.6 24-32V16L32 4z"
                    className="fill-primary"
                    opacity="0.15"
                />
                <path
                    d="M32 4L8 16v16c0 14.4 10.24 27.84 24 32 13.76-4.16 24-17.6 24-32V16L32 4z"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    fill="none"
                />
                {/* Keyhole */}
                <circle
                    cx="32"
                    cy="28"
                    r="7"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    fill="none"
                />
                <path
                    d="M28.5 33l-2 12h11l-2-12"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
            <span
                className="font-semibold tracking-tight text-primary"
                style={{ fontSize: size * 0.65 }}
            >
                Passwork
            </span>
        </div>
    );
}
