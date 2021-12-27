/**
 * These should be 3-4 letter TLDs that the bot should not auto-delete.
 * Usually file extensions, such as .png.
 */
export const allowedTLDs = [
  "txt",
  "json",
  "css",
  "jsx",
  "html",
  "rss",
  "csh",
  "act",
  "ash",
  "rby",
  "pyc",
  "java",
  "vue",
  "php",
  "ashx",
  "xml",
  "rss",
  "cpp",
  "scss",
  "vue",
  "cgi",
  "ogg",
  "wav",
  "wpp",
  "pkg",
  "deb",
  "rpm",
  "zip",
  "dmg",
  "iso",
  "csv",
  "mdb",
  "sql",
  "tar",
  "msg",
  "emlx",
  "vcf",
  "bat",
  "apk",
  "exe",
  "wsf",
  "fnt",
  "font",
  "gif",
  "bmp",
  "icon",
  "jpeg",
  "tiff",
  "asp",
  "aspx",
  "cer",
  "htm",
  "jsp",
  "rss",
  "key",
  "pps",
  "ppt",
  "pptx",
  "odp",
  "xlsx",
  "dll",
  "bak",
  "cab",
  "cfg",
  "ini",
  "drv",
  "icns",
  "tmp",
  "cur",
  "avi",
  "flv",
  "mpg",
  "mpeg",
  "swf",
  "mov",
  "doc",
  "docx",
  "pdf",
  "rtx",
  "tex",
  "wpd",
];

/**
 * These should be TLDs to auto delete that are not covered by the regex
 * (so anything not 3-4 letters).
 */
export const deniedTLDs = [
  "ai",
  "co",
  "io",
  "ly",
  "me",
  "gg",
  "to",
  "uk",
  "be",
  "in",
  "eu",
  "ru",
  "us",
  "za",
  "ee",
  "tk",
  "watch",
];
