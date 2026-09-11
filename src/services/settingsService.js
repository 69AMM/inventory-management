import { readStore, writeStore, delay } from './storage';
import { defaultSettings } from '../data/seedData';

const KEY = 'settings';

export async function getSettings() {
  await delay(100);
  return readStore(KEY, defaultSettings);
}

export async function updateSettings(partial) {
  await delay(100);
  const current = readStore(KEY, defaultSettings);
  const updated = { ...current, ...partial };
  writeStore(KEY, updated);
  return updated;
}
