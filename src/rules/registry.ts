import { aandachtspuntenRules } from './checks/aandachtspunten';
import { bijlagenRules } from './checks/bijlagen';
import { gekoppeldePostenRules } from './checks/gekoppeldeposten';
import { ondertekeningRules } from './checks/ondertekening';
import { reconciliationRules } from './checks/reconciliation';
import { tarievenRules } from './checks/tarieven';
import { volledigheidRules } from './checks/volledigheid';
import type { Rule } from './types';

export const ALL_RULES: Rule[] = [
  ...reconciliationRules,
  ...ondertekeningRules,
  ...tarievenRules,
  ...volledigheidRules,
  ...gekoppeldePostenRules,
  ...aandachtspuntenRules,
  ...bijlagenRules,
];
