import React from 'react';
import cn from 'classnames';
import { SentData } from 'send/slices/sendSlice';
import { Button } from 'common';
import { useAppSelector } from 'application/store';
import { getNetworkChainID } from 'application/selectors';
import { toast } from 'react-toastify';
import { explorerThePowerUrl } from 'appConstants';
import { t } from 'i18next';
import styles from './TxResult.module.scss';
import {
  SuccessSvg,
  // DiscordSvg, FbMessengerSvg, TelegramSvg, TwitterSvg, WechatSvg, WhatsappSvg,
} from './icons';

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
  const chainID = useAppSelector(getNetworkChainID);
  const txExplorerLink = `${explorerThePowerUrl}/${chainID}/transaction/${sentData.txId}`;

  const handleCopyClick = () => {
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
        <Button onClick={handleCopyClick} variant="outlined" fullWidth>{t('share')}</Button>
        <a target="_blank" href={txExplorerLink} style={{ width: '100%' }} rel="noreferrer">
          <Button variant="filled" fullWidth>{t('explorer')}</Button>
        </a>
      </div>
      {/* </div> */}
    </div>
  );
};

export default TxResult;
