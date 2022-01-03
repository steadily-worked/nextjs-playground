import styles from "../styles/alert.module.css";
import cn from "classnames";
import { FC } from "react";

interface Props {
  type: boolean;
}

const Alert: FC<Props> = ({ type, children }) => {
  return (
    <div
      className={cn({
        [styles.success]: type === true,
        [styles.error]: type === false,
      })}
    >
      {children}
    </div>
  );
};

export default Alert;
