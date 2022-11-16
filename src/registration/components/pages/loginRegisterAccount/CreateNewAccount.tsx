import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Select,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { RootState } from 'application/store';
import {
  Tabs,
  OutlinedInput,
  ModalLoader,
  Button,
} from 'common';
import { checkIfLoading } from 'network/selectors';
import styles from '../../Registration.module.scss';
import {
  setCreatingCurrentShard,
  generateSeedPhrase,
  setCreatingStep,
  setSeedPhrase,
  createWallet,
  setCurrentRegisterCreateAccountTab,
} from '../../../slice/registrationSlice';
import {
  CreateAccountStepsEnum,
  LoginRegisterAccountTabs,
  LoginRegisterAccountTabsLabels,
  RegistrationPageAdditionalProps,
} from '../../../typings/registrationTypes';
import { getCurrentCreatingStep, getCurrentShardSelector, getGeneratedSeedPhrase } from '../../../selectors/registrationSelectors';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { RegistrationStatement } from '../../common/RegistrationStatement';
import { compareTwoStrings } from '../../../utils/registrationUtils';

const mapStateToProps = (state: RootState) => ({
  currentShard: getCurrentShardSelector(state),
  creatingStep: getCurrentCreatingStep(state),
  generatedSeedPhrase: getGeneratedSeedPhrase(state),
  loading: checkIfLoading(state, createWallet.type),
});

const mapDispatchToProps = {
  setCreatingCurrentShard,
  generateSeedPhrase,
  setCreatingStep,
  setSeedPhrase,
  createWallet,
  setCurrentRegisterCreateAccountTab,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type CreateNewAccountProps = ConnectedProps<typeof connector> & RegistrationPageAdditionalProps;

interface CreateNewAccountState {
  userSeedPhrase: string;
  confirmedSeedPhrase: string;
  seedsNotEqual: boolean;
  password: string;
  confirmedPassword: string;
  passwordsNotEqual: boolean;
}

class CreateNewAccountComponent extends React.PureComponent<CreateNewAccountProps, CreateNewAccountState> {
  private selectMenuProps = {
    className: styles.loginRegisterAccountCreateSelectMenu,
  };

  constructor(props: CreateNewAccountProps) {
    super(props);
    this.state = {
      userSeedPhrase: '',
      confirmedSeedPhrase: '',
      seedsNotEqual: false,
      password: '',
      confirmedPassword: '',
      passwordsNotEqual: false,
    };
  }

  componentDidMount() {
    this.props.setCurrentRegisterCreateAccountTab(LoginRegisterAccountTabs.create);
  }

  onSelectShard = (event: SelectChangeEvent<number>) => {
    this.props.setCreatingCurrentShard(event.target.value as number);
  };

  submitForm = () => {
    const {
      creatingStep,
      generateSeedPhrase,
      setSeedPhrase,
      generatedSeedPhrase,
      setCreatingStep,
      createWallet,
      setNextStep,
    } = this.props;
    const {
      userSeedPhrase,
      confirmedSeedPhrase,
      password,
      confirmedPassword,
    } = this.state;

    if (creatingStep === CreateAccountStepsEnum.selectSubChain) {
      generateSeedPhrase();
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.setSeedPhrase) {
      setSeedPhrase({
        seedPhrase: (userSeedPhrase || generatedSeedPhrase)!,
        nextStep: CreateAccountStepsEnum.confirmSeedPhrase,
      });
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.confirmSeedPhrase) {
      const seedsNotEqual = !this.compareSeedPhrase(generatedSeedPhrase!, confirmedSeedPhrase);
      if (seedsNotEqual) {
        this.setState({
          seedsNotEqual,
        });
        return;
      }
      setCreatingStep(CreateAccountStepsEnum.encryptPrivateKey);
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.encryptPrivateKey) {
      const passwordsNotEqual = !compareTwoStrings(password, confirmedPassword);

      if (passwordsNotEqual) {
        this.setState({
          passwordsNotEqual: true,
        });
        return;
      }

      createWallet({
        password,
        additionalAction: setNextStep,
      });
    }
  };

  handleBackClick = () => {
    const { creatingStep, setCreatingStep } = this.props;

    if (creatingStep === CreateAccountStepsEnum.setSeedPhrase) {
      setCreatingStep(CreateAccountStepsEnum.selectSubChain);
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.confirmSeedPhrase) {
      setCreatingStep(CreateAccountStepsEnum.setSeedPhrase);
      this.setState({
        seedsNotEqual: false,
        confirmedSeedPhrase: '',
      });
      return;
    }

    if (creatingStep === CreateAccountStepsEnum.encryptPrivateKey) {
      setCreatingStep(CreateAccountStepsEnum.confirmSeedPhrase);
      this.setState({
        password: '',
        confirmedPassword: '',
        passwordsNotEqual: false,
      });
    }
  };

  renderContent = () => {
    const { creatingStep } = this.props;
    switch (creatingStep) {
      case CreateAccountStepsEnum.selectSubChain:
        return this.renderSelectSubChain();
      case CreateAccountStepsEnum.setSeedPhrase:
        return this.renderSetSeedPhrase();
      case CreateAccountStepsEnum.confirmSeedPhrase:
        return this.renderConfirmSeedPhrase();
      case CreateAccountStepsEnum.encryptPrivateKey:
        return this.renderEncryptPrivateKey();
      default:
        return null;
    }
  };

  renderSelectSubChain = () => {
    const { currentShard, tab, onChangeTab } = this.props;

    return <RegistrationBackground>
      <div className={styles.loginRegisterAccountTitle}>
        {'Create, login or import an account'}
      </div>
      <div className={styles.loginRegisterAccountHolder}>
        <Tabs
          tabs={LoginRegisterAccountTabs}
          tabsLabels={LoginRegisterAccountTabsLabels}
          value={tab}
          onChange={onChangeTab}
        />
        <div className={styles.registrationFormHolder}>
          <div className={styles.registrationFormDesc}>
            {'The wallet is still in alpha-testing phase. \nWallet creation may take a couple of minutes'}
          </div>
          <div>{'Selected shard:'}</div>
          <Select
            value={currentShard!}
            className={styles.loginRegisterAccountCreateSelect}
            fullWidth
            MenuProps={this.selectMenuProps}
            onChange={this.onSelectShard}
          >
            <MenuItem value={104}>{104}</MenuItem>
            <MenuItem value={103}>{103}</MenuItem>
          </Select>
        </div>
      </div>
    </RegistrationBackground>;
  };

  onChangeUserSeedPhrase = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      userSeedPhrase: event.target.value,
    });
  };

  onChangeConfirmedSeedPhrase = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      confirmedSeedPhrase: event.target.value,
      seedsNotEqual: false,
    });
  };

  onChangePassword = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      password: event.target.value,
      passwordsNotEqual: false,
    });
  };

  onChangeConfirmedPassword = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      confirmedPassword: event.target.value,
      passwordsNotEqual: false,
    });
  };

  renderSetSeedPhrase = () => {
    const { generatedSeedPhrase } = this.props;
    const { userSeedPhrase } = this.state;

    return <RegistrationBackground>
      <div className={styles.loginRegisterAccountTitle}>
        {'Remember'}
      </div>
      <RegistrationStatement description={'Enter a seed phrase or use the one we provide'} />
      <RegistrationStatement description={'If you specify your own seed phrase it is up to you to make sure it is valid'} />
      <RegistrationStatement description={'Write down your seed phrase and store is somewhere safe'} />
      <RegistrationStatement description={'Seed phrase is the only way to restore your private key'} />
      <div className={styles.setSeedPhraseHolder}>
        <div className={styles.seedPhraseTitle}>
          {'Seed phrase'}
        </div>
        <OutlinedInput
          placeholder={generatedSeedPhrase!}
          className={styles.loginTextArea}
          multiline
          value={userSeedPhrase || generatedSeedPhrase}
          onChange={this.onChangeUserSeedPhrase}
        />
      </div>
    </RegistrationBackground>;
  };

  compareSeedPhrase = (generatedSeed: string, confirmedSeed: string) => (
    generatedSeed.trim().replace(/ +(?= )/g, '') === confirmedSeed.trim().replace(/ +(?= )/g, '')
  );

  renderConfirmSeedPhrase = () => {
    const { generatedSeedPhrase } = this.props;
    const { confirmedSeedPhrase, seedsNotEqual } = this.state;

    return <div className={styles.confirmSeedPhraseHolder}>
      <div className={styles.confirmSeedPhraseTitle}>
        {'Repeat seed phrase'}
      </div>
      <OutlinedInput
        placeholder={generatedSeedPhrase!}
        className={styles.loginTextArea}
        multiline
        value={confirmedSeedPhrase}
        onChange={this.onChangeConfirmedSeedPhrase}
        error={seedsNotEqual}
        fullWidth
        errorMessage={'Oh:( the seed phrase is incorrect, please try again'}
      />
    </div>;
  };

  renderEncryptPrivateKey = () => {
    const { password, confirmedPassword, passwordsNotEqual } = this.state;

    return <RegistrationBackground>
      <div className={styles.loginRegisterAccountTitle}>
        {'Enter password to encrypt your private key'}
      </div>
      <div className={styles.encryptKeyHolder}>
        <OutlinedInput
          placeholder={'Password'}
          className={styles.passwordInput}
          value={password}
          onChange={this.onChangePassword}
          type={'password'}
        />
        <OutlinedInput
          placeholder={'Repeat password'}
          className={styles.passwordInput}
          value={confirmedPassword}
          onChange={this.onChangeConfirmedPassword}
          type={'password'}
          error={passwordsNotEqual}
          errorMessage={'oops, passwords didn\'t match, try again'}
        />
      </div>
    </RegistrationBackground>;
  };

  getSubmitButtonDisabled = () => {
    const { creatingStep, currentShard } = this.props;
    const {
      confirmedSeedPhrase,
      seedsNotEqual,
      password,
      confirmedPassword,
      passwordsNotEqual,
    } = this.state;

    switch (creatingStep) {
      case CreateAccountStepsEnum.selectSubChain:
        return !currentShard;
      case CreateAccountStepsEnum.confirmSeedPhrase:
        return !confirmedSeedPhrase || seedsNotEqual;
      case CreateAccountStepsEnum.encryptPrivateKey:
        return !password || !confirmedPassword || passwordsNotEqual;
      default:
        return false;
    }
  };

  render() {
    const { creatingStep, loading } = this.props;
    return <>
      <ModalLoader
        loadingTitle={'Processing\nvery soon everything will happen'}
        open={loading}
        hideIcon
      />
      {this.renderContent()}
      <div className={styles.registrationButtonsHolder}>
        {
          creatingStep !== CreateAccountStepsEnum.selectSubChain &&
          <Button
            size="medium"
            variant="outlined"
            type="button"
            onClick={this.handleBackClick}
          >
            {'Back'}
          </Button>
        }
        <Button
          size="medium"
          variant="filled"
          type="button"
          onClick={this.submitForm}
          disabled={this.getSubmitButtonDisabled()}
        >
          {'Next'}
        </Button>
      </div>
    </>;
  }
}

export const CreateNewAccount = connector(CreateNewAccountComponent);
