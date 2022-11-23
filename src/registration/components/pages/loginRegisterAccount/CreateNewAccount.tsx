import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Select,
  MenuItem,
  Collapse,
  FormControlLabel,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { RootState } from 'application/store';
import {
  OutlinedInput,
  ModalLoader,
  Button,
  Checkbox,
} from 'common';
import { CheckedIcon, ChevronDown, UnCheckedIcon } from 'common/icons';
import { checkIfLoading } from 'network/selectors';
import classnames from 'classnames';
import styles from '../../Registration.module.scss';
import {
  setCreatingCurrentShard,
  generateSeedPhrase,
  setCreatingStep,
  setSeedPhrase,
  createWallet,
  setCurrentRegisterCreateAccountTab,
  toggleRandomChain,
} from '../../../slice/registrationSlice';
import {
  CreateAccountStepsEnum,
  LoginRegisterAccountTabs,
} from '../../../typings/registrationTypes';
import { getCurrentCreatingStep, getCurrentShardSelector, getGeneratedSeedPhrase } from '../../../selectors/registrationSelectors';
import { RegistrationBackground } from '../../common/RegistrationBackground';
import { RegistrationStatement } from '../../common/RegistrationStatement';
import { compareTwoStrings } from '../../../utils/registrationUtils';
import { getCurrentNetworkChains } from '../../../../application/selectors';

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
type CreateNewAccountProps = ConnectedProps<typeof connector> & {
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
      {'select a chain'}
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
          {'The wallet is still in alpha-testing phase. \nWallet creation may take a couple of minutes'}
        </div>
        <Collapse in={!randomChain}>
          <div className={styles.loginRegisterAccountShardTitle}>
            {'Selected chain:'}
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
        label="If you need a specific chain, check the box and select the chain"
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

    return <RegistrationBackground className={styles.confirmSeedPhraseHolder}>
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
    </RegistrationBackground>;
  };

  renderEncryptPrivateKey = () => {
    const { password, confirmedPassword, passwordsNotEqual } = this.state;

    return <RegistrationBackground className={styles.enterPasswordBackground}>
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
      {
        creatingStep !== CreateAccountStepsEnum.selectSubChain &&
        <div className={styles.registrationButtonsHolder}>
          <Button
            size="medium"
            variant="outlined"
            type="button"
            onClick={this.handleBackClick}
          >
            {'Back'}
          </Button>
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
      }
    </>;
  }
}

export const CreateNewAccount = connector(CreateNewAccountComponent);
