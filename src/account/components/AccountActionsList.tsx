import React from 'react';
import { AccountActionType } from '../typings/accountTypings';
import styles from './Account.module.scss';

interface AccountActionsListProps {
  actions: AccountActionType[];
}

class AccountActionsListComponent extends React.PureComponent<AccountActionsListProps, {}> {
  renderActionItem = (item: AccountActionType) => {
    const { Icon, title, action } = item;

    return <div
      className={styles.accountAction}
      key={title}
      onClick={action}
    >
      <Icon className={styles.icon} />
      <span className={styles.accountActionText}>{title}</span>
    </div>;
  };

  render() {
    return <div className={styles.accountActionsHolder}>
      {this.props.actions.map(this.renderActionItem)}
    </div>;
  }
}

export const AccountActionsList = AccountActionsListComponent;
