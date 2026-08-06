import "./Loader.scss";

interface LoaderProps {
  text?: string;
}

const Loader = ({ text = "Загрузка..." }: LoaderProps) => {
  return (
    <div className="loader">
      <div className="loader-spinner"></div>

      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
