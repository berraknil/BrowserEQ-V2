export function useStorage<T>(key: string, defaultValue: T) {
  return {
    get: async () => {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? defaultValue;
    },
    set: async (value: T) => {
      await chrome.storage.local.set({ [key]: value });
    },
  };
}
