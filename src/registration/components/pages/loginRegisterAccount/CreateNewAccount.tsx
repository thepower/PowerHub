import {
  Collapse,
  FormControlLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { RootState } from 'application/store';
import classnames from 'classnames';
import {
  Button,
  Checkbox,
  ModalLoader,
  OutlinedInput,
} from 'common';
import { CheckedIcon, ChevronDown, UnCheckedIcon } from 'common/icons';
import { checkIfLoading } from 'network/selectors';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { getCurrentNetworkChains } from '../../../../application/selectors';
import { getCurrentCreatingStep, getCurrentShardSelector, getGeneratedSeedPhrase } from '../../../selectors/registrationSelectors';
import {
  createWallet,
  generateSeedPhrase,
  setCreatingCurrentShard,
  setCreatingStep,
  setCurrentRegisterCreateAccountTab,
  setSeedPhrase,
  toggleRandomChain,
} from '../../../slice/registrationSlice';
import {
  CreateAccountStepsEnum,
  LoginRegisterAccountTabs,
} from '../../../typings/registrationTypes';
import { compareTwoStrings } from '../../../utils/registrationUtils';
import styles from '../../Registration.module.scss';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { RegistrationStatement } from '../../common/RegistrationStatement';

const mapStateToProps = (state: RootState) => ({
  currentShard: getCurrentShardSelector(state),
  creatingStep: getCurrentCreatingStep(state),
  generatedSeedPhrase: getGeneratedSeedPhrase(state),
  loading: checkIfLoading(state, createWallet.type),
  networkChains: getCurrentNetworkChains(state),
});

const mapDispatchToProps = {
  setCreatingCurrentShard,
  generateSeedPhrase,
  setCreatingStep,
  setSeedPhrase,
  createWallet,
  setCurrentRegisterCreateAccountTab,
  toggleRandomChain,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type CreateNewAccountProps = ConnectedProps<typeof connector> & WithTranslation & {
  setNextStep: () => void;
  randomChain: boolean;
};

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
    classes: {
      paper: styles.loginRegisterAccountShardPaper,
      list: styles.loginRegisterAccountShardMenu,
    },
  };

  private selectInputProps = {
    className: styles.loginRegisterAccountShardInput,
  };

  private selectClasses = {
    icon: styles.loginRegisterAccountShardIcon,
  };

  private selectChainCheckboxClasses = {
    label: styles.selectChainCheckboxLabel,
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
      randomChain,
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
        randomChain,
      });
    }
  };

  toggleRandomChain = () => {
    this.props.toggleRandomChain();
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

  renderShardSelectValue = (value: number) => {
    if (value) {
      return value;
    }

    return <div className={styles.loginRegisterAccountShardPlaceholder}>
      {this.props.t('selectChain')}
    </div>;
  };

  renderNetworkMenuItem = (chain: number) => (
    <MenuItem
      key={chain}
      className={styles.loginRegisterAccountShardMenuItem}
      value={chain}
    >
      {chain}
    </MenuItem>
  );

  renderRandomChainCheckbox = () => (
    <Checkbox
      size={'medium'}
      checked={!this.props.randomChain}
      onClick={this.toggleRandomChain}
      checkedIcon={<CheckedIcon />}
      icon={<UnCheckedIcon />}
      disableRipple
    />
  );

  renderSelectSubChain = () => {
    const { currentShard, networkChains, randomChain } = this.props;

    return <>
      <div className={styles.registrationFormHolder}>
        <div className={styles.registrationFormDesc}>
          {this.props.t('theWalletAlphaTestingPhase')}
        </div>
        <Collapse in={!randomChain}>
          <div className={styles.loginRegisterAccountShardTitle}>
            {this.props.t('selectedChain')}
          </div>
          <Select
            value={currentShard!}
            className={classnames(
              styles.loginRegisterAccountCreateSelect,
              currentShard ? styles.loginRegisterAccountCreateSelectWithValue : '',
            )}
            fullWidth
            MenuProps={this.selectMenuProps}
            onChange={this.onSelectShard}
            displayEmpty
            inputProps={this.selectInputProps}
            classes={this.selectClasses}
            renderValue={this.renderShardSelectValue}
            IconComponent={ChevronDown}
          >
            {networkChains?.map(this.renderNetworkMenuItem)}
          </Select>
        </Collapse>
      </div>
      <FormControlLabel
        control={this.renderRandomChainCheckbox()}
        label={this.props.t('IfYouNeedSpecificChain')}
        classes={this.selectChainCheckboxClasses}
      />
    </>;
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

    return <RegistrationBackground className={styles.rememberBackground}>
      <div className={classnames(styles.loginRegisterAccountTitle, styles.rememberTitle)}>
        {this.props.t('remember')}
      </div>
      <RegistrationStatement description={this.props.t('enterSeedPhrase')} />
      <RegistrationStatement description={this.props.t('IfYouSpecifyYourOwnSeedPhrase')} />
      <RegistrationStatement description={this.props.t('writeDownYourSeedPhraseAndStore')} />
      <RegistrationStatement description={this.props.t('seedPhraseIsTheOnlyWay')} />
      <div className={styles.setSeedPhraseHolder}>
        <div className={styles.seedPhraseTitle}>
          {this.props.t('seedPhrase')}
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

    return <RegistrationBackground className={styles.confirmSeedPhraseHolder}>
      <div className={styles.confirmSeedPhraseTitle}>
        {this.props.t('repeatSeedPhrase')}
      </div>
      <OutlinedInput
        placeholder={generatedSeedPhrase!}
        className={styles.loginTextArea}
        multiline
        value={confirmedSeedPhrase}
        onChange={this.onChangeConfirmedSeedPhrase}
        error={seedsNotEqual}
        fullWidth
        errorMessage={this.props.t('ohSeedPhraseIncorrect')!}
      />
    </RegistrationBackground>;
  };

  renderEncryptPrivateKey = () => {
    const { password, confirmedPassword, passwordsNotEqual } = this.state;

    return <RegistrationBackground className={styles.enterPasswordBackground}>
      <div className={styles.loginRegisterAccountTitle}>
        {this.props.t('enterPasswordEncryptYour')}
      </div>
      <div className={styles.encryptKeyHolder}>
        <OutlinedInput
          placeholder={this.props.t('password')!}
          className={styles.passwordInput}
          value={password}
          onChange={this.onChangePassword}
          type={'password'}
        />
        <OutlinedInput
          placeholder={this.props.t('repeatPassword')!}
          className={styles.passwordInput}
          value={confirmedPassword}
          onChange={this.onChangeConfirmedPassword}
          type={'password'}
          error={passwordsNotEqual}
          errorMessage={this.props.t('oopsPasswordsDidntMatch')!}
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
        loadingTitle={this.props.t('processingVerySoonEverythingWillHappen')}
        open={loading}
        hideIcon
      />
      {this.renderContent()}
      {
        creatingStep !== CreateAccountStepsEnum.selectSubChain &&
        <div className={styles.registrationButtonsHolder}>
          <Button
            size="medium"
            variant="outlined"
            type="button"
            onClick={this.handleBackClick}
          >
            {this.props.t('back')}
          </Button>
          <Button
            size="medium"
            variant="filled"
            type="button"
            onClick={this.submitForm}
            disabled={this.getSubmitButtonDisabled()}
          >
            {this.props.t('next')}
          </Button>
        </div>
      }
    </>;
  }
}

export const CreateNewAccount = withTranslation()(connector(CreateNewAccountComponent));
