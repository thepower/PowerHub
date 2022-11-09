import { createBrowserHistory } from 'history';
import historyWithQuery from 'qhistory';
import { stringify, parse } from 'qs';

const history = createBrowserHistory();

export default historyWithQuery(history, stringify, parse);
