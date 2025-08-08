type SocialMedia = {
    INSTAGRAM: string;
};

type AppConstants = {
    SPOTIFY_URL: string;
    SOCIAL_MEDIA: SocialMedia;
};

export const APP_CONSTANTS: AppConstants = {
    SPOTIFY_URL: "https://open.spotify.com/intl-pt/artist/01EugPjOLrrusH1v4TT0Yb",
    SOCIAL_MEDIA: {
        INSTAGRAM: "https://www.instagram.com/forrodohorizonte",
    },
} as const;
