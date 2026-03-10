export const ErrorField = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              !
            </text>
          </svg>
          {message}
        </p>
  ) : null;