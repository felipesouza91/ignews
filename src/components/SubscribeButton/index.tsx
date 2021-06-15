import styles from './styles.module.scss';

interface ISubscribeButtonProps {
  priceId: string;
}

const SubscribeButton: React.FC<ISubscribeButtonProps> = ({ priceId }) => {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
};

export default SubscribeButton;
