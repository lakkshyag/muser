// this is 99.9999% not necessary to do
// but ive observed that for whatever reason spotify adds an
// undocumented (i think) query parameter after the link:
// ex: (the ?si=.... after the actual playlist / album url)
// playlist/5my4DCwdTaeeSdLioAjbED?si=f1211f7cbcb24f92
// album/2k9f4qBmEx1GgY4I3XT42r?si=zKONAsCMRaOAQY-mKvSI-g
// god knows what it does, and as far as i know just the prefix
// before the ?si is required, so im removing it just in case
// some tracking shenanigans are happening here
// thank me later when your data does not get stolen

export const cleanSpotifyUrl = (url) => {
    const cleanUrl = url.split('?')[0]; 
    return cleanUrl;
};