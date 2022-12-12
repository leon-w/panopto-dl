export type OptionKey = "ffmpegPath";
export type OptionType = string;

export const OPTION_DEFAULT_VALUES: Record<OptionKey, OptionType> = {
    ffmpegPath: "ffmpeg",
};

export abstract class OptionsManager {
    static async getStringOption(optionKey: OptionKey): Promise<string> {
        const { [optionKey]: result } = await chrome.storage.local.get({
            [optionKey]: OPTION_DEFAULT_VALUES[optionKey],
        });
        return result;
    }

    static async setStringOption(optionKey: OptionKey, value: string): Promise<void> {
        await chrome.storage.local.set({ [optionKey]: value });
    }
}
