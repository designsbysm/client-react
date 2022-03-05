import { environment } from '../../environments/environment';
import { getToken } from '../appToken';
import * as join from 'url-join';

const conditionURL = (url = '') => join(environment.apiURL, url);

const conditionOptions = (options = {}) => {
  const { body, headers } = options;
  const updates = { ...options };

  // add auth
  const token = getToken();
  if (token !== 'undefined') {
    updates.headers = {
      ...updates.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (!body || (headers && headers['Content-Type'])) {
    return updates;
  }

  const bodyType = typeof body;
  if (bodyType === 'object') {
    updates.body = JSON.stringify(body);
    updates.headers = {
      ...updates.headers,
      'Content-Type': 'application/json',
    };
  }

  return updates;
};

// TODO: make .post, .get, or etc functions?

export default (url, options) => {
  const requestURL = conditionURL(url);
  const requestOptions = conditionOptions(options);

  return fetch(requestURL, requestOptions)
    .then(async res => {
      const { ok } = res;

      if (!ok) {
        throw res;
      }

      const text = await res.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch (err) {
        // eat error
      }

      return json || text;
    });
};
