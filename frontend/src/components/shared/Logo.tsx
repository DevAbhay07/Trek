interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const Logo = ({ className = "w-10 h-10", showText = true, textClassName = "ml-3 text-xl font-bold text-gray-900" }: LogoProps) => {
  return (
    <div className="flex items-center">
      <img 
        src="/images/image.png"
        alt="Prabandh Logo" 
        className={`${className} object-contain`}
        loading="eager"
        onError={(e) => {
          console.error('Failed to load logo image');
          e.currentTarget.style.display = 'none';
        }}
      />
      {showText && (
        <span className={textClassName}>
          Park Prabandh
        </span>
      )}
    </div>
  );
};

export default Logo;
