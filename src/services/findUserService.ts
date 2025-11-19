// src/services/findUserService.ts

import { apiEndpoints } from './apiEndpoints';

export interface ContactMediumCharacteristic {
  contactType?: string;
  emailAddress?: string;
  phoneNumber?: string;
  [key: string]: any;
}

export interface ContactMedium {
  mediumType?: string;
  characteristic?: ContactMediumCharacteristic;
}

export interface RelatedParty {
  id?: string;
  role?: string;
  href?: string;
  name?: string;
  '@referredType'?: string;
  '@type'?: string;
}

export interface FindUserRecord {
  id: string;
  fullName?: string;
  givenName?: string;
  familyName?: string;
  contactMedium?: ContactMedium[];
  relatedParty?: RelatedParty[];
}

export interface FindUserQuery {
  offset?: number;
  limit?: number;
}

export async function fetchFindUser(
  accessToken: string,
  query: FindUserQuery
): Promise<FindUserRecord[]> {
  if (!accessToken) {
    throw new Error('Missing access token for findUser call.');
  }

  const url = new URL(apiEndpoints.findUser);
  if (typeof query.offset === 'number') {
    url.searchParams.set('offset', String(query.offset));
  }
  if (typeof query.limit === 'number') {
    url.searchParams.set('limit', String(query.limit));
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'SelfServiceMobile/1.0',
    },
  });

  const responseSummary = `APIMAN[FindUser] ${response.status}`;

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${responseSummary}: ${body || 'empty response body'}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('findUser response is not an array.');
  }

  return payload as FindUserRecord[];
}
