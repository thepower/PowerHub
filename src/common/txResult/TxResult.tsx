import { getNetworkChainID } from 'application/selectors';
import { useAppSelector } from 'application/store';
import cn from 'classnames';
import { Button } from 'common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SentData } from 'send/slices/sendSlice';
import appEnvs from 'appEnvs';
import styles from './TxResult.module.scss';
import { SuccessSvg } from './icons';

type TxResultProps = {
  sentData: SentData
  className?: string;
};

// const socialLinks = [
//   { Icon: TelegramSvg, url: '' },
//   { Icon: DiscordSvg, url: '' },
//   { Icon: FbMessengerSvg, url: '' },
//   { Icon: TwitterSvg, url: '' },
//   { Icon: WechatSvg, url: '' },
//   { Icon: WhatsappSvg, url: '' },
// ];

const TxResult: React.FC<TxResultProps> = ({
  sentData,
  className,
}) => {
  const { t } = useTranslation();
  const chainID = useAppSelector(getNetworkChainID);
  const txExplorerLink = `${appEnvs.EXPLORER_THEPOWER_URL}/${chainID}/transaction/${sentData.txId}`;

  const onClickBack = () => {
    if (sentData.returnURL) { window.location.replace(sentData.returnURL); }
  };

  const onCopyClick = () => {
    navigator.clipboard.writeText(txExplorerLink);
    toast.info(t('linkTransactionCopied'));
  };

  return (
    <div className={styles.txResult}>
      <div className={cn(styles.result, className)}>
        <div>
          <div className={styles.resultKey}>{t('amount')}</div>
          <div className={styles.resultValue}>
            {sentData?.amount}
            {/* <LogoIcon height={24} width={24} className={styles.icon} /> */}
          </div>
        </div>
        <div>
          <div className={styles.resultKey}>{t('from')}</div>
          <div className={styles.resultValue}>{sentData?.from}</div>
        </div>
        <div>
          <div className={styles.resultKey}>{t('to')}</div>
          <div className={styles.resultValue}>{sentData?.to}</div>
        </div>
        <div>
          <div className={styles.resultKey}>{t('tx')}</div>
          <div className={styles.resultValue_success}>
            {sentData?.txId}
            <SuccessSvg className={styles.resultValue__successIcon} />
          </div>
        </div>
        <div>
          <div className={styles.commentLabel}>{t('comments')}</div>
          <div className={styles.comment}>{sentData?.comment}</div>
        </div>
      </div>
      {/* <div className={styles.columns}> */}
      {/* <div className={styles.socials}>
        {socialLinks.map(({ Icon, url }) => <Icon className={styles.socialsIcon} />)}
      </div> */}
      <div className={styles.buttons}>
        <Button onClick={onCopyClick} variant="outlined" fullWidth>{t('share')}</Button>
        <a target="_blank" href={txExplorerLink} style={{ width: '100%' }} rel="noreferrer">
          <Button variant="filled" fullWidth>{t('explorer')}</Button>
        </a>
      </div>
      {sentData.returnURL && <Button onClick={onClickBack} variant="filled" fullWidth>{t('return')}</Button>}
      {/* </div> */}
    </div>
  );
};

export default TxResult;
