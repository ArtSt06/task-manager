import "./Loader.scss";

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
}

const Loader = ({ fullPage = false, text = "Загрузка..." }: LoaderProps) => {
  const className = "loader" + fullPage ? "loader-fullpage" : "";

  return (
    <div className={className}>
      <div className="loader-spinner"></div>

      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
