const { Telegraf } = require("telegraf");
const fs = require("fs-extra");
const path = require("path");
const JsConfuser = require("js-confuser");
const config = require("./config");
const axios = require('axios');
const { webcrack } = require("webcrack");
const crypto = require("crypto")
const { Client } = require('ssh2');

const bot = new Telegraf(config.BOT_TOKEN);
const userData = {};

const log = (message, error = null) => {
    const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
    const prefix = `\x1b[36m[ VexxuzzZ Obf Botz ]\x1b[0m`;
    const timeStyle = `\x1b[33m[${timestamp}]\x1b[0m`;
    const msgStyle = `\x1b[32m${message}\x1b[0m`;
    console.log(`${prefix} ${timeStyle} ${msgStyle}`);
    if (error) {
        const errorStyle = `\x1b[31m✖ Error: ${error.message || error}\x1b[0m`;
        console.error(`${prefix} ${timeStyle} ${errorStyle}`);
        if (error.stack) console.error(`\x1b[90m${error.stack}\x1b[0m`);
    }
};

// Fungsi untuk memberikan contoh format
const example = () => {
  return "Contoh: /installpanel ipvps|pwvps|panel.com|node.com|ramserver (contoh: 100000)";
};

const CF_API_TOKEN = 'CQ4aK4fwUmH3RbM52vI5myFv-IxTIFTsguvRnGpi'; // Ganti dengan API Token yang benar!
const CF_ZONE_ID = '2d45a678eab00687ebcb1111beffaf2b'; // Zone ID Anda


// Fungsi untuk memberikan contoh format
const examplee = () => {
  return "Contoh: /addsubdomain sub.domain.com|192.168.1.1 (A record) atau sub.domain.com|target.com (CNAME)";
};


// Path untuk file JSON
const USERS_FILE = "./users.json";

// Fungsi untuk memuat pengguna dari JSON
function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, "utf-8");
            return new Set(JSON.parse(data));
        }
        return new Set();
    } catch (error) {
        log("Gagal memuat pengguna dari JSON", error);
        return new Set();
    }
}

// Fungsi untuk menyimpan pengguna ke JSON
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify([...users], null, 2));
    } catch (error) {
        log("Gagal menyimpan pengguna ke JSON", error);
    }
}

// Muat pengguna saat bot dimulai
let users = loadUsers();



// Fungsi untuk memeriksa keanggotaan channel
async function checkChannelMembership(ctx) {
    const channelId = "@VexxuzzZEncryptPrivate"; // ID channel
    try {
        const chatMember = await ctx.telegram.getChatMember(channelId, ctx.from.id);
        return ["member", "administrator", "creator"].includes(chatMember.status);
    } catch (error) {
        log("Gagal memeriksa keanggotaan channel", error);
        return false;
    }
}


// Konstanta fungsi async untuk obfuscation Time-Locked Encryption
const obfuscateTimeLocked = async (fileContent, days) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    const expiryTimestamp = expiryDate.getTime();
    try {
        const obfuscated = await JsConfuser.obfuscate(
            `(function(){const expiry=${expiryTimestamp};if(new Date().getTime()>expiry){throw new Error('Script has expired after ${days} days');}${fileContent}})();`,
            {
                target: "node",
                compact: true,
                renameVariables: true,
                renameGlobals: true,
                identifierGenerator: "randomized",
                stringCompression: true,
                stringConcealing: true,
                stringEncoding: true,
                controlFlowFlattening: 0.75,
                flatten: true,
                shuffle: true,
                rgf: false,
                opaquePredicates: {
                    count: 6,
                    complexity: 4
                },
                dispatcher: true,
                globalConcealing: true,
                lock: {
                    selfDefending: true,
                    antiDebug: (code) => `if(typeof debugger!=='undefined'||process.env.NODE_ENV==='debug')throw new Error('Debugging disabled');${code}`,
                    integrity: true,
                    tamperProtection: (code) => `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`
                },
                duplicateLiteralsRemoval: true
            }
        );
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        return obfuscatedCode;
    } catch (error) {
        throw new Error(`Gagal obfuscate: ${error.message}`);
    }
};

// Command /enclocked untuk enkripsi dengan masa aktif dalam hari

// Konstanta fungsi async untuk obfuscation Quantum Vortex Encryption
const obfuscateQuantum = async (fileContent) => {
    // Generate identifier unik berdasarkan waktu lokal
    const generateTimeBasedIdentifier = () => {
        const timeStamp = new Date().getTime().toString().slice(-5);
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$#@&*";
        let identifier = "qV_";
        for (let i = 0; i < 7; i++) {
            identifier += chars[Math.floor((parseInt(timeStamp[i % 5]) + i * 2) % chars.length)];
        }
        return identifier;
    };

    // Tambahkan kode phantom berdasarkan milidetik
    const currentMilliseconds = new Date().getMilliseconds();
    const phantomCode = currentMilliseconds % 3 === 0 ? `if(Math.random()>0.999)console.log('PhantomTrigger');` : "";

    try {
        const obfuscated = await JsConfuser.obfuscate(fileContent + phantomCode, {
            target: "node",
            compact: true,
            renameVariables: true,
            renameGlobals: true,
            identifierGenerator: generateTimeBasedIdentifier,
            stringCompression: true,
            stringConcealing: false,
            stringEncoding: true,
            controlFlowFlattening: 0.85, // Intensitas lebih tinggi untuk versi 2.0
            flatten: true,
            shuffle: true,
            rgf: true,
            opaquePredicates: {
                count: 8, // Peningkatan count untuk versi 2.0
                complexity: 5
            },
            dispatcher: true,
            globalConcealing: true,
            lock: {
                selfDefending: true,
                antiDebug: (code) => `if(typeof debugger!=='undefined'||(typeof process!=='undefined'&&process.env.NODE_ENV==='debug'))throw new Error('Debugging disabled');${code}`,
                integrity: true,
                tamperProtection: (code) => `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`
            },
            duplicateLiteralsRemoval: true
        });
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        // Self-evolving code dengan XOR dinamis
        const key = currentMilliseconds % 256;
        obfuscatedCode = `(function(){let k=${key};return function(c){return c.split('').map((x,i)=>String.fromCharCode(x.charCodeAt(0)^(k+(i%16)))).join('');}('${obfuscatedCode}');})()`;
        return obfuscatedCode;
    } catch (error) {
        throw new Error(`Gagal obfuscate: ${error.message}`);
    }
};

// Command /encquantum untuk enkripsi Quantum Vortex Encryption


// Konfigurasi obfuscation untuk Siu + Calcrick style dengan keamanan ekstrem
const getSiuCalcrickObfuscationConfig = () => {
    const generateSiuCalcrickName = () => {
        // Identifier generator pseudo-random tanpa crypto
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 6; i++) { // 6 karakter untuk keseimbangan
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `CalceKarik和SiuSiu无与伦比的帅气${randomPart}`;
    };

    return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,       
        stringEncoding: true,           
        stringSplitting: true,      
    controlFlowFlattening: 0.95,
    shuffle: true,
        rgf: false,
        flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
        }
    };
};

// Command /encsiucalcrick

// Command /encgalaxy

// Konfigurasi obfuscation untuk Nebula style dengan banyak opsi aktif
const getNebulaObfuscationConfig = () => {
    const generateNebulaName = () => {
        // Identifier generator pseudo-random tanpa crypto atau timeHash
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const prefix = "NX";
        let randomPart = "";
        for (let i = 0; i < 4; i++) {
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `${prefix}${randomPart}`;
    };

    return {
        target: "node",
        compact: true,                  // Minimalkan whitespace
        renameVariables: true,          // Rename variabel
        renameGlobals: true,            // Rename global untuk keamanan
        identifierGenerator: generateNebulaName,
        stringCompression: true,        // Kompresi string
        stringConcealing: false,         // Sembunyikan string
        stringEncoding: true,           // Enkripsi string
        stringSplitting: false,          // Pecah string untuk kebingungan
        controlFlowFlattening: 0.75,     // Aktif dengan intensitas sedang
        flatten: true,                  // Ratakan struktur kode
        shuffle: true,                  // Acak urutan eksekusi
        rgf: true,                      // Randomized Global Functions
        deadCode: true,                 // Tambah kode mati untuk kebingungan
        opaquePredicates: true,         // Predikat buram
        dispatcher: true,               // Acak eksekusi fungsi
        globalConcealing: true,         // Sembunyikan variabel global
        objectExtraction: true,         // Ekstrak objek untuk kebingungan
        duplicateLiteralsRemoval: true,// Pertahankan duplikat untuk kebingungan
        lock: {
            selfDefending: true,        // Lindungi dari modifikasi
            antiDebug: true,            // Cegah debugging
            integrity: true,            // Pastikan integritas
            tamperProtection: true      // Lindungi dari tampering
        }
    };
};

// Fungsi invisible encoding yang efisien dan kecil
function encodeInvisible(text) {
    try {
        // Kompresi kode dengan menghapus spasi berlebih
        const compressedText = text.replace(/\s+/g, ' ').trim();
        // Gunakan base64 untuk efisiensi
        const base64Text = Buffer.from(compressedText).toString('base64');
        // Tambahkan penanda invisible di awal
        return '\u200B' + base64Text; // Hanya penanda awal untuk invisibility minimal
    } catch (e) {
        log("Gagal encode invisible", e);
        return Buffer.from(text).toString('base64'); // Fallback ke base64
    }
}


// Konfigurasi obfuscation untuk Nova style
const getNovaObfuscationConfig = () => {
    const generateNovaName = () => {
        // Identifier generator unik dan keren
        const prefixes = ["nZ", "nova", "nx"];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const hash = crypto.createHash('sha256')
            .update(crypto.randomBytes(8))
            .digest('hex')
            .slice(0, 6); // Ambil 6 karakter pertama dari hash SHA-256
        const suffix = Math.random().toString(36).slice(2, 5); // Sufiks acak 3 karakter
        return `${randomPrefix}_${hash}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: generateNovaName, 
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5, 
        flatten: true,
        shuffle: true,
        rgf: false,
        deadCode: false, 
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Fungsi decode invisible yang efisien
function decodeInvisible(encodedText) {
    try {
        if (!encodedText.startsWith('\u200B')) return encodedText; // Fallback jika tidak ada penanda
        const base64Text = encodedText.slice(1); // Hapus penanda invisible
        return Buffer.from(base64Text, 'base64').toString('utf-8');
    } catch (e) {
        log("Gagal decode invisible", e);
        return encodedText; // Fallback ke teks asli
    }
}

// Konfigurasi obfuscation untuk X style
const getXObfuscationConfig = () => {
    const generateXName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return "xZ" + crypto.randomUUID().slice(0, 4); // Nama pendek dan unik
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateXName(),
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5, // Stabil dan aman
        flatten: true,
        shuffle: true,
        rgf: true,
        deadCode: false, // Nonaktif untuk ukuran kecil
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Max style dengan intensitas yang dapat diatur
const getMaxObfuscationConfig = (intensity) => {
    const generateMaxName = () => {
        // Nama variabel unik: prefiks "mX" + kombinasi acak
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 4) + 4; // 4-7 karakter
        let name = "mX";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    // Skala intensitas dari 1-10 ke 0.1-1.0 untuk controlFlowFlattening
    const flatteningLevel = intensity / 10;

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateMaxName(),
        stringCompression: true, // Kompresi string
        stringConcealing: true, // Menyembunyikan string
        stringEncoding: true, // Enkripsi string
        stringSplitting: true, // Memecah string
        controlFlowFlattening: flatteningLevel, // Intensitas berdasarkan input (0.1-1.0)
        flatten: true, // Meratakan struktur kontrol
        shuffle: true, // Mengacak urutan
        rgf: true, // Randomized Global Functions
        calculator: true, // Mengacak operasi matematika
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true, // Mengacak eksekusi
        globalConcealing: true, // Menyembunyikan variabel global
        objectExtraction: true, // Mengekstrak objek untuk kebingungan
        duplicateLiteralsRemoval: false, // Menjaga redundansi
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Konfigurasi obfuscation standar (diperkuat dan aman)
const getObfuscationConfig = (level = "high") => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: level === "high" ? 0.95 : level === "medium" ? 0.75 : 0.5,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
});

// Konfigurasi obfuscation untuk Strong style (diperbaiki berdasarkan dokumentasi)
const getStrongObfuscationConfig = () => {
    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: "randomized", // Valid: menghasilkan nama acak
        stringEncoding: true, // Valid: mengenkripsi string
        stringSplitting: true, // Valid: memecah string
        controlFlowFlattening: 0.75, // Valid: mengacak alur kontrol
        duplicateLiteralsRemoval: true, // Valid: menghapus literal duplikat
        calculator: true, // Valid: mengacak operasi matematika
        dispatcher: true, // Valid: mengacak eksekusi dengan dispatcher
        deadCode: true, // Valid: menambahkan kode mati
        opaquePredicates: true, // Valid: menambahkan predikat buram
        lock: {
            selfDefending: true, // Valid: mencegah modifikasi
            antiDebug: true, // Valid: mencegah debugging
            integrity: true, // Valid: memastikan integritas
            tamperProtection: true // Valid: perlindungan tamper
        }
    };
};

// Konfigurasi obfuscation untuk Big style (ukuran file besar)
const getBigObfuscationConfig = () => {
    const generateBigName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 5) + 5; // Nama 5-9 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateBigName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Stabil dan kuat
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Konfigurasi obfuscation untuk Invisible style (diperbaiki)
const getInvisObfuscationConfig = () => {
    const generateInvisName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += "_"; // Menggunakan underscore untuk "invis" yang aman
        }
        // Tambahkan variasi acak agar unik
        return name + Math.random().toString(36).substring(2, 5);
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateInvisName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Stealth style (diperbaiki untuk stabilitas)
const getStealthObfuscationConfig = () => {
    const generateStealthName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 3) + 1; // Nama pendek 1-3 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateStealthName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Dikurangi untuk stabilitas
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Custom style (dengan nama kustom)
const getCustomObfuscationConfig = (customName) => {
    const generateCustomName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomSuffixLength = Math.floor(Math.random() * 3) + 2; // Sufiks acak 2-4 karakter
        let suffix = "";
        for (let i = 0; i < randomSuffixLength; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        // Gunakan nama kustom sebagai prefiks, tambahkan sufiks acak
        return `${customName}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateCustomName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Stabil dan kuat
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Mandarin style (diperkuat dan aman)
const getMandarinObfuscationConfig = () => {
    const mandarinChars = [
        "龙", "虎", "风", "云", "山", "河", "天", "地", "雷", "电",
        "火", "水", "木", "金", "土", "星", "月", "日", "光", "影",
        "峰", "泉", "林", "海", "雪", "霜", "雾", "冰", "焰", "石"
    ];

    const generateMandarinName = () => {
        const length = Math.floor(Math.random() * 4) + 3;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += mandarinChars[Math.floor(Math.random() * mandarinChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateMandarinName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Arab style (diperkuat dan aman)
const getArabObfuscationConfig = () => {
    const arabicChars = [
        "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
        "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
        "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
    ];

    const generateArabicName = () => {
        const length = Math.floor(Math.random() * 4) + 3;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += arabicChars[Math.floor(Math.random() * arabicChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateArabicName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

const getJapanxArabObfuscationConfig = () => {
    const japaneseXArabChars = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も", "や", "ゆ", "よ","أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
        "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
        "ق", "ك", "ل", "م", "ن", "ه", "و", "ي","ら", "り", "る", "れ", "ろ", "わ", "を", "ん" 
    ];

    const generateJapaneseXArabName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += japaneseXArabChars[Math.floor(Math.random() * japaneseXArabChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateJapaneseXArabName(),
        stringCompression: true, // Kompresi string
        stringConcealing: true, // Menyembunyikan string
        stringEncoding: true, // Enkripsi string
        stringSplitting: true, // Memecah string        
        controlFlowFlattening: 0.95, // Sedikit lebih rendah untuk variasi
        flatten: true,              // Metode baru: mengganti struktur kontrol
        shuffle: true,
        rgf: false,
        dispatcher: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};
const getUltraObfuscationConfig = () => {
    const generateUltraName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        return `z${randomNum}${randomChar}${Math.random().toString(36).substring(2, 6)}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateUltraName(),
        stringCompression: true, // Kompresi string untuk keamanan tinggi
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9,
        flatten: true,
        shuffle: true,
        rgf: true, // Randomized Global Functions
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Japan style (diperkuat dan aman)
const getJapanObfuscationConfig = () => {
    const japaneseChars = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も", "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ", "わ", "を", "ん"
    ];

    const generateJapaneseName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateJapaneseName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9, // Sedikit lebih rendah untuk variasi
        flatten: true,              // Metode baru: mengganti struktur kontrol
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk /encnew (diperkuat dan aman)
const getNewObfuscationConfig = () => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
});

// Progress bar
const createProgressBar = (percentage) => {
    const total = 10;
    const filled = Math.round((percentage / 100) * total);
    return "▰".repeat(filled) + "▱".repeat(total - filled);
};

// Update progress
async function updateProgress(ctx, message, percentage, status) {
    const bar = createProgressBar(percentage);
    const levelText = percentage === 100 ? "✅ Selesai" : `⚙️ ${status}`;
    try {
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            message.message_id,
            null,
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ${levelText} (${percentage}%)\n` +
            ` ${bar}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ",
            { parse_mode: "Markdown" }
        );
        await new Promise(resolve => setTimeout(resolve, Math.min(800, percentage * 8)));
    } catch (error) {
        log("Gagal memperbarui progres", error);
    }
}


// Command /start untuk menyapa pengguna dan menampilkan menu
bot.start(async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);
    await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    const inlineKeyboard = [
        [
            { text: '𝑪𝒉𝒂𝒏𝒏𝒆𝒍 「🔊」', url: 'https://t.me/VexxuzzZ13' },
            { text: '𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓 「👤」', url: 'https://t.me/VexxuzzZ' }
        ],
        [
            { text: '𝑰𝒏𝒇𝒐 𝑩𝒐𝒕 「🤖」', callback_data: 'infobot' },
            { text: '𝑹𝒂𝒏𝒅𝒐𝒎𝑴𝒆𝒏𝒖 「⚙️」', callback_data: 'randommenu' }
        ],
        [    
            { text: '𝒐𝒃𝒇𝒎𝒆𝒏𝒖 「⚙️」', callback_data: 'obf_menu' }, 
            { text: '𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓 「👤」', url: 'https://Wa.me/+6285773466911' }
        ]
    ];

    setTimeout(async () => {
        await ctx.replyWithPhoto("https://files.catbox.moe/l87ffw.jpg", {
            caption: `
╭─────ZYUROXZ INFINITE V1.0
│⟣ Developer : @Vexxuzzz
│⟣ Version : 1.0
│⟣ Status : Online
│⟣ Sender : 𝐙𝐘𝐔𝐑𝐎𝐗𝐙 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐄
│
╰──────────────────❏
╭──[𖥂] 「 BUG MENU 」
│► /stronges - 628XXX
│   ┗► Executed Ui System
│   ┗► Example: /stronges 628XXX
│   ┗► Only Crash Total
│
│► /quertytrash - 628XXX
│   ┗► Executed CrashCursor
│   ┗► Example: /quertytrash 628XXX
│   ┗► Only Forclose
│
│► /xsbeta - 628XXX 
│   ┗► Executed Delay Beta
│   ┗► Example: /xsbeta 628XXX
│   ┗► Only Beta Crash
│
│► /delaymassage - 628XXX
│   ┗► Executed Delaymassage
│   ┗► Example: /delaymassage 628XXX
│   ┗► Only Delay Version
│
│► /invisitrash - 628XXX
│   ┗► Executed invisitrash
│   ┗► Example: /invisitrash 628XXX
│   ┗► Only Invisible Version
╰──────────────────❍
            `,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: inlineKeyboard
            }
        });
    }, 1000); // Delay 1 detik
});

bot.action("obf_menu", (ctx) => {
    ctx.editMessageCaption(`
Hello, I'am Encrypt Bot obf, Created By @VexxuzzZ
お役に立てれば幸いです 💋
━━━━━━━━━━━━━━━━━━━━━
╭═─═─⊱ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗
║ ヤ /enc <LEVEL> - STANDARD OBFUSCATION
│ ヤ /enceval <LEVEL> - EVALUATE & OBFUSCATE
║ ヤ /encchina - MANDARIN STYLE
│ ヤ /encarab - ARABIC STYLE
║ ヤ /encjapan - JAPANESE STYLE
│ ヤ /encinvis - INVISIBLE MODE
║ ヤ /encjapxab - JAPAN X ARAB
│ ヤ /encx - BASE 64
║ ヤ /encnebula - HARD DESIGN
│ ヤ /encnova - NOVA STYLE
║ ヤ /encsiu - SIU + CALCRICK 
│ ヤ /customenc <NAME> - CUSTOM DESIGN
║ ヤ /encmax <INTENSITY> - CUSTOM INTENSITY
│ ヤ /encstralth - STEALTH MODE
║ ヤ /encstrong - POWER FORTRESS
│ ヤ /encultra - ULTRA PROTECTION
╎ ヤ /deobfuscate - DECRYPT FILE
║ ヤ /encbig <MB> - MEGABYTE MODE
│ ヤ /encnew - ADVANCED LAYER
║ ヤ /encquantum QUANTUM FORTEX 
│ ヤ /enclocked LOCKED HARD
╚─═─═─═─═─═─═─═─═─═─═─═─⊱
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '𝑪𝒉𝒂𝒏𝒏𝒆𝒍 「🔊」', url: 'https://t.me/VexxuzzZ13' },
                    { text: '𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓 「👤」', url: 'https://t.me/VexxuzzZ' }
                ],
                [
                    { text: '𝑰𝒏𝒇𝒐 𝑩𝒐𝒕 「🤖」', callback_data: 'infobot' },
                    { text: '𝑹𝒂𝒏𝒅𝒐𝒎𝑴𝒆𝒏𝒖 「⚙️」', callback_data: 'randommenu' }
                ],
                [    
                    { text: '𝒐𝒃𝒇𝒎𝒆𝒏𝒖 「⚙️」', callback_data: 'obf_menu' }, 
                    { text: '𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓 「👤」', url: 'https://Wa.me/+6285773466911' }
                ]
            ]
        }
    });
});

// Action untuk tombol "Info"
bot.action("infobot", (ctx) => {
    ctx.editMessageCaption(`
┏═━═━⫹⫺ 𝗢𝗕𝗙 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 🔒
║ ☍ ɪɴᴛᴇɴsɪᴛʏ : 1 - 10 [ CONTROL FLOW ]
┃ ☍ ʟᴇᴠᴇʟs : Low | Medium | Hight [ DEFAULT : HIGHT ]
║ ☍ ᴄʜᴀɴɴᴇʟ : @VexxuzzZ13
┃ ☍ ᴅᴇᴠᴇʟᴏᴘᴇʀ : @VexxuzzZ
╚━═━═━═━═━═━═━═━═━═━❍
Stay secure with VexxuzzZ! 
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [,
                [{ text: '🔙 BACK', callback_data: 'start_menu' }]
            ]
        }
    });
});

// Action untuk tombol "Settings" (placeholder)
bot.action("randommenu", (ctx) => {
    ctx.editMessageCaption(`
┏═━═━⫹⫺ 𝗥𝗔𝗡𝗗𝗢𝗠 𝗠𝗘𝗡𝗨
║ ヤ /installpanel
┃ ヤ /addsubdomain 
║ ヤ /payment
┃
╚━═━═━═━═━═━═━═━═━═━❍
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 BACK', callback_data: 'start_menu' }]
            ]
        }
    });
});

// Action untuk kembali ke menu utama
bot.action("start_menu", (ctx) => {
    ctx.editMessageCaption(`
╭─────ZYUROXZ INFINITE V1.0
│⟣ Developer : @Vexxuzzz
│⟣ Version : 1.0
│⟣ Status : Online
│⟣ Sender : 𝐙𝐘𝐔𝐑𝐎𝐗𝐙 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐄
│
╰──────────────────❏
╭──[𖥂] 「 BUG MENU 」
│► /stronges - 628XXX
│   ┗► Executed Ui System
│   ┗► Example: /stronges 628XXX
│   ┗► Only Crash Total
│
│► /quertytrash - 628XXX
│   ┗► Executed CrashCursor
│   ┗► Example: /quertytrash 628XXX
│   ┗► Only Forclose
│
│► /xsbeta - 628XXX 
│   ┗► Executed Delay Beta
│   ┗► Example: /xsbeta 628XXX
│   ┗► Only Beta Crash
│
│► /delaymassage - 628XXX
│   ┗► Executed Delaymassage
│   ┗► Example: /delaymassage 628XXX
│   ┗► Only Delay Version
│
│► /invisitrash - 628XXX
│   ┗► Executed invisitrash
│   ┗► Example: /invisitrash 628XXX
│   ┗► Only Invisible Version
╰──────────────────❍
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '𝑪𝒉𝒂𝒏𝒏𝒆𝒍 「🔊」', url: 'https://t.me/VexxuzzZ13' },
                    { text: '𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓 「👤」', url: 'https://t.me/VexxuzzZ' }
                ],
                [
                    { text: '𝑰𝒏𝒇𝒐 𝑩𝒐𝒕 「🤖」', callback_data: 'infobot' },
                    { text: '𝑹𝒂𝒏𝒅𝒐𝒎𝑴𝒆𝒏𝒖 「⚙️」', callback_data: 'randommenu' }
                ],
                [    
                    { text: '𝒐𝒃𝒇𝒎𝒆𝒏𝒖 「⚙️」', callback_data: 'obf_menu' }, 
                    { text: '𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓 「👤」', url: 'https://Wa.me/+6285773466911' }
                ]
            ]
        }
    });
});


// Command /enc (diperkuat dengan pemeriksaan channel)
bot.command("enc", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enc [level]`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const args = ctx.message.text.split(" ");
    const encryptionLevel = ["low", "medium", "high"].includes(args[1]) ? args[1] : "high";
    const encryptedPath = path.join(__dirname, `encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (${encryptionLevel}) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );
        
        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        const fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 30, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 40, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan level: ${encryptionLevel}`);
        await updateProgress(ctx, progressMessage, 50, "Inisialisasi Hardened Enkripsi");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getObfuscationConfig(encryptionLevel));
        await updateProgress(ctx, progressMessage, 70, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 90, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi: encrypted-${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Enkripsi (${encryptionLevel})`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat mengenkripsi", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /enceval (diperkuat dengan pemeriksaan channel)
bot.command("enceval", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enceval [level]`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const args = ctx.message.text.split(" ");
    const encryptionLevel = ["low", "medium", "high"].includes(args[1]) ? args[1] : "high";
    const encryptedPath = path.join(__dirname, `eval-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai Evaluasi (${encryptionLevel}) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk evaluasi: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        const fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        let evalResult;
        try {
            await updateProgress(ctx, progressMessage, 30, "Mengevaluasi Kode Asli");
            evalResult = eval(fileContent);
            if (typeof evalResult === "function") {
                evalResult = "Function detected (cannot display full output)";
            } else if (evalResult === undefined) {
                evalResult = "No return value";
            }
        } catch (evalError) {
            evalResult = `Evaluation error: ${evalError.message}`;
        }

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 40, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi dan mengevaluasi file dengan level: ${encryptionLevel}`);
        await updateProgress(ctx, progressMessage, 50, "Inisialisasi Hardened Enkripsi");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getObfuscationConfig(encryptionLevel));
        await updateProgress(ctx, progressMessage, 70, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 90, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi dan hasil evaluasi: ${file.file_name}`);
        await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot - Evaluation Result\n" +
            "```\n" +
            `✨ *Original Code Result:* \n\`\`\`javascript\n${evalResult}\n\`\`\`\n` +
            `_Level: ${encryptionLevel} | Powered by VexxuzzZ`
        );
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `eval-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi siap!*\n_SUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Evaluasi & Enkripsi (${encryptionLevel})`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat mengenkripsi/evaluasi", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encchina (diperkuat dengan pemeriksaan channel)
bot.command("encchina", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encchina`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `china-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Mandarin) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Mandarin obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Mandarin yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Mandarin Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getMandarinObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Mandarin: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `china-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Mandarin) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Mandarin Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Mandarin obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});


bot.command("broadcast", async (ctx) => {
    // Tambahkan pengguna ke daftar broadcast
    users.add(ctx.from.id);
    saveUsers(users);

    // Hanya admin yang bisa broadcast (ambil dari config.js)
    if (ctx.from.id !== config.ADMIN_ID) {
        return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Hanya admin yang bisa menggunakan perintah ini!");
    }

    const message = ctx.message.text.split(" ").slice(1).join(" ");
    if (!message) {
        return ctx.replyWithMarkdown("❌ *Error:* Tulis pesan untuk broadcast, contoh: `/broadcast Halo semua!`");
    }

    log(`Mengirim broadcast: ${message}`);
    let successCount = 0;
    let failCount = 0;

    for (const userId of users) {
        try {
            await bot.telegram.sendMessage(userId, message, { parse_mode: "Markdown" });
            successCount++;
        } catch (error) {
            log(`Gagal mengirim ke ${userId}`, error);
            failCount++;
        }
    }

    await ctx.replyWithMarkdown(
        `📢 *Broadcast Selesai:*\n` +
        `- Berhasil dikirim ke: ${successCount} pengguna\n` +
        `- Gagal dikirim ke: ${failCount} pengguna`
    );
});

// Command /encarab (diperkuat dengan pemeriksaan channel)
bot.command("encarab", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encarab`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `arab-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Arab) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Arab obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Arab yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Arab Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getArabObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Arab: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `arab-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Arab) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Arab Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Arab obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encjapan (Japan-style obfuscation baru, diperkuat dengan pemeriksaan channel)
bot.command("encjapan", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encjapan`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `japan-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Japan) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Japan obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Japan yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Japan Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getJapanObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Japan: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `japan-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Japan) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Japan Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Japan obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encjapxab", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encjapxab`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `japan-arab-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Japan X Arab ) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Japan X Arab  obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Japan X Arab  yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Japan X Arab  Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getJapanxArabObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Japan X Arab : ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `japan-arab-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Japan X Arab ) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Japan X Arab  Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Japan X Arab  obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});
// Command /encnew (diperkuat dengan pemeriksaan channel)
bot.command("encnew", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encnew`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `new-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Advanced) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk New obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan metode baru yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Advanced Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getNewObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi metode baru: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `new-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Advanced) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Advanced Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat New obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encinvis", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encinvis`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `invis-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Invisible) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Invisible obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Invisible yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Invisible Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getInvisObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Invisible: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `invis-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Invisible) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Invisible Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Invisible obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encstealth", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encstealth`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `stealth-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Stealth) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Stealth obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Stealth yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Stealth Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getStealthObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Stealth: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `stealth-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Stealth) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Stealth Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Stealth obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("customenc", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    // Ambil nama kustom dari perintah
    const args = ctx.message.text.split(" ");
    if (args.length < 2 || !args[1]) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/customenc <nama>` dengan nama kustom!");
    }
    const customName = args[1].replace(/[^a-zA-Z0-9_]/g, ""); // Sanitasi input, hanya huruf, angka, dan underscore
    if (!customName) {
        return ctx.replyWithMarkdown("❌ *Error:* Nama kustom harus berisi huruf, angka, atau underscore!");
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/customenc <nama>`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `custom-${customName}-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Custom: ${customName}) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Custom obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Custom (${customName}) yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Custom Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getCustomObfuscationConfig(customName));
        log(`Hasil obfuscation (50 char pertama): ${obfuscated.code.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi kode hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            log(`Kode hasil obfuscation tidak valid: ${postObfuscationError.message}`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Mengirim file terenkripsi gaya Custom: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `custom-${customName}-encrypted-${file.file_name}` },
            { caption: `✅ *File terenkripsi (Hardened Custom: ${customName}) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Hardened Custom (${customName}) Obfuscation Selesai`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Custom obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /deobfuscate (diperbaiki untuk menangani Promise dan validasi)
bot.command("deobfuscate", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js yang diobfuscate dengan `/deobfuscate`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const deobfuscatedPath = path.join(__dirname, `deobfuscated-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai Deobfuscation (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        // Mengunduh file
        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk deobfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        // Validasi kode awal
        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode Awal");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        // Proses deobfuscation dengan webcrack
        log(`Memulai deobfuscation dengan webcrack: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 40, "Memulai Deobfuscation");
        const result = await webcrack(fileContent); // Pastikan await digunakan
        let deobfuscatedCode = result.code;

        // Penanganan jika kode dibundel
        let bundleInfo = "";
        if (result.bundle) {
            bundleInfo = "// Detected as bundled code (e.g., Webpack/Browserify)\n";
            log(`Kode terdeteksi sebagai bundel: ${file.file_name}`);
        }

        // Jika tidak ada perubahan signifikan atau hasil bukan string
        if (!deobfuscatedCode || typeof deobfuscatedCode !== "string" || deobfuscatedCode.trim() === fileContent.trim()) {
            log(`Webcrack tidak dapat mendekode lebih lanjut atau hasil bukan string: ${file.file_name}`);
            deobfuscatedCode = `${bundleInfo}// Webcrack tidak dapat mendekode sepenuhnya atau hasil invalid\n${fileContent}`;
        }

        // Validasi kode hasil
        log(`Memvalidasi kode hasil deobfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 60, "Memvalidasi Kode Hasil");
        let isValid = true;
        try {
            new Function(deobfuscatedCode);
            log(`Kode hasil valid: ${deobfuscatedCode.substring(0, 50)}...`);
        } catch (syntaxError) {
            log(`Kode hasil tidak valid: ${syntaxError.message}`);
            deobfuscatedCode = `${bundleInfo}// Kesalahan validasi: ${syntaxError.message}\n${deobfuscatedCode}`;
            isValid = false;
        }

        // Simpan hasil
        await updateProgress(ctx, progressMessage, 80, "Menyimpan Hasil");
        await fs.writeFile(deobfuscatedPath, deobfuscatedCode);

        // Kirim hasil
        log(`Mengirim file hasil deobfuscation: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: deobfuscatedPath, filename: `deobfuscated-${file.file_name}` },
            { caption: `✅ *File berhasil dideobfuscate!${isValid ? "" : " (Perhatikan pesan error dalam file)"}*\nSUKSES ENCRYPT BY VexxuzzZ 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Deobfuscation Selesai");

        // Hapus file sementara
        if (await fs.pathExists(deobfuscatedPath)) {
            await fs.unlink(deobfuscatedPath);
            log(`File sementara dihapus: ${deobfuscatedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat deobfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan file Javascript yang valid!_`);
        if (await fs.pathExists(deobfuscatedPath)) {
            await fs.unlink(deobfuscatedPath);
            log(`File sementara dihapus setelah error: ${deobfuscatedPath}`);
        }
    }
});

// Command /encstrong (Obfuscation baru dengan metode Strong)
bot.command("encstrong", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encstrong`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `strong-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Strong) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Strong obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Strong`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Strong Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getStrongObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Strong: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `strong-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Strong) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Strong Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Strong obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});


// Command /encbig <size_in_mb> (Obfuscation dengan ukuran besar)
bot.command("encbig", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    // Ambil target ukuran dari perintah
    const args = ctx.message.text.split(" ");
    if (args.length < 2 || !args[1] || isNaN(args[1])) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/encbig <size_in_mb>` dengan ukuran dalam MB (angka)!");
    }
    const targetSizeMB = Math.max(1, parseInt(args[1], 10)); // Minimal 1 MB

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encbig <size_in_mb>`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `big-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Big: ${targetSizeMB}MB) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Big obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Big`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Big Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getBigObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        // Tambahkan padding secara manual untuk meningkatkan ukuran
        const currentSizeBytes = Buffer.byteLength(obfuscatedCode, "utf8");
        const targetSizeBytes = targetSizeMB * 1024 * 1024; // Konversi MB ke bytes
        if (currentSizeBytes < targetSizeBytes) {
            const paddingSize = targetSizeBytes - currentSizeBytes;
            const padding = crypto.randomBytes(paddingSize).toString("base64");
            obfuscatedCode += `\n/* Binary Padding (${paddingSize} bytes) */\n// ${padding}`;
            log(`Padding ditambahkan: ${paddingSize} bytes`);
        }

        log(`Memvalidasi hasil obfuscation dengan padding: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid setelah padding: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Big: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `big-encrypted-${file.file_name}` },
            { caption: `✅ *File terenkripsi (Hardened Big: ${targetSizeMB}MB) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Hardened Big (${targetSizeMB}MB) Obfuscation Selesai`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Big obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});



// Command /encultra (Obfuscation baru dengan metode Ultra)
bot.command("encultra", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encultra`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `ultra-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Ultra) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Ultra obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Ultra`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Ultra Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getUltraObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Ultra: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `ultra-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Ultra) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Ultra Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Ultra obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encmax <intensity> (Obfuscation dengan metode Max dan intensitas yang dapat diatur)
bot.command("encmax", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    // Ambil intensitas dari perintah
    const args = ctx.message.text.split(" ");
    if (args.length < 2 || !args[1] || isNaN(args[1])) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/encmax <intensity>` dengan intensitas (1-10)!");
    }
    const intensity = Math.min(Math.max(1, parseInt(args[1], 10)), 10); // Batas 1-10

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encmax <intensity>`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `max-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Max Intensity ${intensity}) (1%)\n` +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Max obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Max (Intensity ${intensity})`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Max Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getMaxObfuscationConfig(intensity));
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Max: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `max-encrypted-${file.file_name}` },
            { caption: `✅ *File terenkripsi (Hardened Max, Intensity ${intensity})*\nSUKSES ENCRYPT BY VexxuzzZ 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Hardened Max (Intensity ${intensity}) Obfuscation Selesai`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Max obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encquantum", async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);

    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encquantum`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `quantum-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Quantum Vortex Encryption) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Quantum Vortex Encryption: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan Quantum Vortex Encryption`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Quantum Vortex Encryption");
        const obfuscatedCode = await obfuscateQuantum(fileContent);
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi quantum: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `quantum-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Quantum Vortex Encryption) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Quantum Vortex Encryption Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Quantum obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encx
bot.command("encx", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encx`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `x-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Hardened X Invisible) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk X obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya X`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened X Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getXObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation sebelum encoding (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);

        // Tambahkan lapisan invisible encoding
        const encodedInvisible = encodeInvisible(obfuscatedCode);
        const finalCode = `
        (function(){
            function decodeInvisible(encodedText) {
                if (!encodedText.startsWith('\u200B')) return encodedText;
                try {
                    return Buffer.from(encodedText.slice(1), 'base64').toString('utf-8');
                } catch (e) {
                    return encodedText;
                }
            }
            try {
                const hiddenCode = "${encodedInvisible}";
                const decodedCode = decodeInvisible(hiddenCode);
                if (!decodedCode || decodedCode === hiddenCode) throw new Error("Decoding failed");
                eval(decodedCode);
            } catch (e) {
                console.error("Execution error:", e);
            }
        })();
        `;
        log(`Hasil obfuscation dengan invisible encoding (50 char pertama): ${finalCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(finalCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${finalCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, finalCode);

        log(`Mengirim file terenkripsi gaya X: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `x-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened X Invisible) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened X Invisible Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat X obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encnova
bot.command("encnova", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encnova`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `nova-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Nova Dynamic) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Nova obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Nova`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Nova Dynamic Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getNovaObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Nova: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `nova-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Nova Dynamic) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Nova Dynamic Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Nova obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encnebula", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encnebula`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `nebula-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Nebula Polymorphic Storm) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Nebula obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Nebula`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Nebula Polymorphic Storm");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getNebulaObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Nebula: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `nebula-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Nebula Polymorphic Storm) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Nebula Polymorphic Storm Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Nebula obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encsiu", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encsiucalcrick`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `siucalcrick-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Calcrick Chaos Core) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Siu+Calcrick obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Siu+Calcrick`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Calcrick Chaos Core");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getSiuCalcrickObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Siu+Calcrick: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `siucalcrick-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Calcrick Chaos Core) siap!*\nSUKSES ENCRYPT BY VexxuzzZ 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Calcrick Chaos Core Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Siu+Calcrick obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("enclocked", async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);

    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @VexxuzzZ13 ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/VexxuzzZ13)"
        );
    }

    const args = ctx.message.text.split(" ").slice(1);
    if (args.length !== 1 || !/^\d+$/.test(args[0]) || parseInt(args[0]) < 1 || parseInt(args[0]) > 365) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/enclocked [1-365]` untuk jumlah hari (misal: `/enclocked 7`)!");
    }

    const days = args[0];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    const expiryFormatted = expiryDate.toLocaleDateString();

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enclocked [1-365]`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `locked-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Time-Locked Encryption) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "PROSES ENCRYPT BY VexxuzzZ"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Time-Locked Encryption: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan Time-Locked Encryption`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Time-Locked Encryption");
        const obfuscatedCode = await obfuscateTimeLocked(fileContent, days);
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi time-locked: ${file.file_name}`);
        await ctx.replyWithMarkdown(
            `✅ *File terenkripsi (Time-Locked Encryption) siap!*\n` +
            `⏰ Masa aktif: ${days} hari (Kedaluwarsa: ${expiryFormatted})\n` +
            `_Powered by VexxuzzZ_`,
            { parse_mode: "Markdown" }
        );
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `locked-encrypted-${file.file_name}` }
        );
        await updateProgress(ctx, progressMessage, 100, "Time-Locked Encryption Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Time-Locked obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /addowner - Menambahkan owner baru
bot.command("addowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addowner <id_user>");
    }

    if (ownerList.includes(userId)) {
        return await ctx.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai owner.`);
    }

    ownerList.push(userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner baru sekarang memiliki akses ke perintah /addadmin, /addprem, dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Command /delowner - Menghapus owner
bot.command("delowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delowner <id_user>");
    }

    if (!ownerList.includes(userId)) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai owner.`);
    }

    ownerList = ownerList.filter(id => id !== userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner tersebut tidak lagi memiliki akses seperti owner.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Command /addadmin - Menambahkan admin baru
bot.command("addadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addadmin <id_user>");
    }

    addAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin baru sekarang memiliki akses ke perintah /addprem dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});

// Command /deladmin - Menghapus admin
bot.command("deladmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /deladmin <id_user>");
    }

    removeAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin tersebut tidak lagi memiliki akses ke perintah /addprem dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});

// Callback Query untuk Menampilkan Daftar Admin
bot.action("listadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Maaf, Anda tidak memiliki akses untuk melihat daftar admin.");
    }

    const adminListString = adminList.length > 0
        ? adminList.map(id => `- ${id}`).join("\n")
        : "Tidak ada admin yang terdaftar.";

    const message = `
ℹ️ Daftar Admin:

${adminListString}

Total: ${adminList.length} admin.
    `;

    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});

// Command /addprem - Menambahkan user premium
bot.command("addprem", async (ctx) => {
    if (!OctxR_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addprem <id_user> <durasi_hari>");
    }

    const userId = args[1];
    const durationDays = parseInt(args[2]);

    if (isNaN(durationDays) || durationDays <= 0) {
        return await ctx.reply("❌ Durasi hari harus berupa angka positif.");
    }

    addPremiumUser(userId, durationDays);

    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Premium User*.

*Detail:*
- *ID User:* ${userId}
- *Durasi:* ${durationDays} hari
- *Kadaluarsa:* ${formattedExpiration} WIB

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Cek Status Premium", callback_data: `cekprem_${userId}` }]
            ]
        }
    });
});

// Command /delprem - Menghapus user premium
bot.command("delprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delprem <id_user>");
    }

    if (!premiumUsers[userId]) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    removePremiumUser(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Premium User*.

*Detail:*
- *ID User:* ${userId}

User tersebut tidak lagi memiliki akses ke fitur premium.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// --- Command /cekusersc ---
bot.command("cekusersc", async (ctx) => {
    const totalDevices = deviceList.length;
    const deviceMessage = `
ℹ️ Saat ini terdapat *${totalDevices} device* yang terhubung dengan script ini.
    `;

    await ctx.replyWithMarkdown(deviceMessage);
});

// --- Command /monitoruser ---
bot.command("monitoruser", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let userList = "";
    for (const userId in userActivity) {
        const user = userActivity[userId];
        userList += `
- *ID:* ${userId}
 *Nickname:* ${user.nickname}
 *Terakhir Dilihat:* ${user.last_seen}
`;
    }

    const message = `
👤 *Daftar Pengguna Bot:*
${userList}
Total Pengguna: ${Object.keys(userActivity).length}
    `;

    await ctx.replyWithMarkdown(message);
});


// Command /addowner - Menambahkan owner baru
bot.command("addowner", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = VexxuzzZ.message.text.split(" ")[1];
    if (!userId) {
        return await VexxuzzZ.reply("❌ Format perintah salah. Gunakan: /addowner <id_user>");
    }

    if (ownerList.includes(userId)) {
        return await VexxuzzZ.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai owner.`);
    }

    ownerList.push(userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner baru sekarang memiliki akses ke perintah /addadmin, /addprem, dan /delprem.
    `;

    await VexxuzzZ.replyWithMarkdown(successMessage);
});

// Command /delowner - Menghapus owner
bot.command("delowner", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = VexxuzzZ.message.text.split(" ")[1];
    if (!userId) {
        return await VexxuzzZ.reply("❌ Format perintah salah. Gunakan: /delowner <id_user>");
    }

    if (!ownerList.includes(userId)) {
        return await VexxuzzZ.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai owner.`);
    }

    ownerList = ownerList.filter(id => id !== userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner tersebut tidak lagi memiliki akses seperti owner.
    `;

    await VexxuzzZ.replyWithMarkdown(successMessage);
});

// Command /addadmin - Menambahkan admin baru
bot.command("addadmin", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = VexxuzzZ.message.text.split(" ")[1];
    if (!userId) {
        return await VexxuzzZ.reply("❌ Format perintah salah. Gunakan: /addadmin <id_user>");
    }

    addAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin baru sekarang memiliki akses ke perintah /addprem dan /delprem.
    `;

    await VexxuzzZ.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});

// Command /deladmin - Menghapus admin
bot.command("deladmin", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = VexxuzzZ.message.text.split(" ")[1];
    if (!userId) {
        return await VexxuzzZ.reply("❌ Format perintah salah. Gunakan: /deladmin <id_user>");
    }

    removeAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin tersebut tidak lagi memiliki akses ke perintah /addprem dan /delprem.
    `;

    await VexxuzzZ.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});

// Callback Query untuk Menampilkan Daftar Admin
bot.action("listadmin", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id)) {
        return await VexxuzzZ.answerCbQuery("❌ Maaf, Anda tidak memiliki akses untuk melihat daftar admin.");
    }

    const adminListString = adminList.length > 0
        ? adminList.map(id => `- ${id}`).join("\n")
        : "Tidak ada admin yang terdaftar.";

    const message = `
ℹ️ Daftar Admin:

${adminListString}

Total: ${adminList.length} admin.
    `;

    await VexxuzzZ.answerCbQuery();
    await VexxuzzZ.replyWithMarkdown(message);
});

// Command /addprem - Menambahkan user premium
bot.command("addprem", async (VexxuzzZ) => {
    if (!OVexxuzzZR_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id) && !isAdmin(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const args = VexxuzzZ.message.text.split(" ");
    if (args.length < 3) {
        return await VexxuzzZ.reply("❌ Format perintah salah. Gunakan: /addprem <id_user> <durasi_hari>");
    }

    const userId = args[1];
    const durationDays = parseInt(args[2]);

    if (isNaN(durationDays) || durationDays <= 0) {
        return await VexxuzzZ.reply("❌ Durasi hari harus berupa angka positif.");
    }

    addPremiumUser(userId, durationDays);

    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Premium User*.

*Detail:*
- *ID User:* ${userId}
- *Durasi:* ${durationDays} hari
- *Kadaluarsa:* ${formattedExpiration} WIB

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

    await VexxuzzZ.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Cek Status Premium", callback_data: `cekprem_${userId}` }]
            ]
        }
    });
});

// Command /delprem - Menghapus user premium
bot.command("delprem", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id) && !isAdmin(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = VexxuzzZ.message.text.split(" ")[1];
    if (!userId) {
        return await VexxuzzZ.reply("❌ Format perintah salah. Gunakan: /delprem <id_user>");
    }

    if (!premiumUsers[userId]) {
        return await VexxuzzZ.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    removePremiumUser(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Premium User*.

*Detail:*
- *ID User:* ${userId}

User tersebut tidak lagi memiliki akses ke fitur premium.
    `;

    await VexxuzzZ.replyWithMarkdown(successMessage);
});

// Callback Query untuk Menampilkan Status Premium
bot.action(/cekprem_(.+)/, async (VexxuzzZ) => {
    const userId = VexxuzzZ.match[1];
    if (userId !== VexxuzzZ.from.id.toString() && !OWNER_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id) && !isAdmin(VexxuzzZ.from.id)) {
        return await VexxuzzZ.answerCbQuery("❌ Anda tidak memiliki akses untuk mengecek status premium user lain.");
    }

    if (!premiumUsers[userId]) {
        return await VexxuzzZ.answerCbQuery(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
    const timeLeft = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').fromNow();

    const message = `
ℹ️ Status Premium User *${userId}*

*Detail:*
- *ID User:* ${userId}
- *Kadaluarsa:* ${formattedExpiration} WIB
- *Sisa Waktu:* ${timeLeft}

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

    await VexxuzzZ.answerCbQuery();
    await VexxuzzZ.replyWithMarkdown(message);
});

// --- Command /cekusersc ---
bot.command("cekusersc", async (VexxuzzZ) => {
    const totalDevices = deviceList.length;
    const deviceMessage = `
ℹ️ Saat ini terdapat *${totalDevices} device* yang terhubung dengan script ini.
    `;

    await VexxuzzZ.replyWithMarkdown(deviceMessage);
});

// --- Command /monitoruser ---
bot.command("monitoruser", async (VexxuzzZ) => {
    if (!OWNER_ID(VexxuzzZ.from.id) && !isOwner(VexxuzzZ.from.id)) {
        return await VexxuzzZ.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let userList = "";
    for (const userId in userActivity) {
        const user = userActivity[userId];
        userList += `
- *ID:* ${userId}
 *Nickname:* ${user.nickname}
 *Terakhir Dilihat:* ${user.last_seen}
`;
    }

    const message = `
👤 *Daftar Pengguna Bot:*
${userList}
Total Pengguna: ${Object.keys(userActivity).length}
    `;

    await VexxuzzZ.replyWithMarkdown(message);
});

// Perintah installpanel


// Perintah installpanel
bot.command('installpanel', (ctx) => {
  users.add(ctx.from.id);
    saveUsers(users);
    
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (!text) {
    return ctx.reply(example());
  }

  const vii = text.split('|');
  if (vii.length < 5) {
    return ctx.reply(example());
  }

  // Simpan data pengguna
  userData[ctx.from.id] = {
    ip: vii[0],
    password: vii[1],
    domainpanel: vii[2],
    domainnode: vii[3],
    ramserver: vii[4],
    step: 'installing',
  };

  ctx.reply('Memproses instalasi server panel...\nTunggu 1-10 menit hingga proses selesai.');
  startInstallation(ctx);
});

// Fungsi instalasi
function startInstallation(ctx) {
  const userId = ctx.from.id;
  if (!userData[userId]) {
    ctx.reply('Data pengguna tidak ditemukan, silakan ulangi perintah.');
    return;
  }

  const { ip, password, domainpanel, domainnode, ramserver } = userData[userId];

  const ress = new Client();
  const connSettings = {
    host: ip,
    port: 22,
    username: 'root',
    password: password,
  };

  const passwordPanel = `admin${Math.random().toString(36).substring(7)}`; // Random password
  const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;

  // Fungsi untuk instal wings
  const installWings = (conn) => {
    conn.exec(commandPanel, (err, stream) => {
      if (err) {
        ctx.reply(`Gagal menjalankan instalasi wings: ${err.message}`);
        delete userData[userId];
        return;
      }
      stream
        .on('close', (code, signal) => {
          conn.exec(
            'bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)',
            (err, stream) => {
              if (err) {
                ctx.reply(`Gagal menjalankan pembuatan node: ${err.message}`);
                delete userData[userId];
                return;
              }
              stream
                .on('close', async (code, signal) => {
                  const teks = `
𝗕𝗘𝗥𝗜𝗞𝗨𝗧 𝗗𝗔𝗧𝗔 𝗣𝗔𝗡𝗘𝗟 𝗔𝗡𝗗𝗔 📎 :

💋 ᴜsᴇʀɴᴀᴍᴇ : admin
💋 ᴘᴀssᴡᴏʀᴅ : ${passwordPanel}
💋 ᴅᴏᴍᴀɪɴ : ${domainpanel}

Note : Silahkan Buat Allocation & Ambil Token Wings Di Node Yang Sudah Di Buat Oleh Bot Untuk Menjalankan Wings         `;
                  await ctx.reply(teks);
                  delete userData[userId]; // Bersihkan data setelah selesai
                })
                .on('data', (data) => {
                  const output = data.toString();
                  console.log(output);
                  if (output.includes('Masukkan nama lokasi:')) stream.write('Singapore\n');
                  if (output.includes('Masukkan deskripsi lokasi:')) stream.write('Node By PrelXz\n');
                  if (output.includes('Masukkan domain:')) stream.write(`${domainnode}\n`);
                  if (output.includes('Masukkan nama node:')) stream.write('Node By PrelXz\n');
                  if (output.includes('Masukkan RAM (dalam MB):')) stream.write(`${ramserver}\n`);
                  if (output.includes('Masukkan jumlah maksimum disk space (dalam MB):')) stream.write(`${ramserver}\n`);
                  if (output.includes('Masukkan Locid:')) stream.write('1\n');
                })
                .stderr.on('data', (data) => console.log('Stderr: ' + data));
            }
          );
        })
        .on('data', (data) => {
          const output = data.toString();
          console.log('Logger: ' + output);
          if (output.includes('Input 0-6')) stream.write('1\n');
          if (output.includes('(y/N)')) stream.write('y\n');
          if (output.includes('Enter the panel address')) stream.write(`${domainpanel}\n`);
          if (output.includes('Database host username')) stream.write('admin\n');
          if (output.includes('Database host password')) stream.write('admin\n');
          if (output.includes('Set the FQDN to use for Let\'s Encrypt')) stream.write(`${domainnode}\n`);
          if (output.includes('Enter email address for Let\'s Encrypt')) stream.write('admin@gmail.com\n');
        })
        .stderr.on('data', (data) => console.log('STDERR: ' + data));
    });
  };

  // Fungsi untuk instal panel
  const installPanel = (conn) => {
    conn.exec(commandPanel, (err, stream) => {
      if (err) {
        ctx.reply(`Gagal menjalankan instalasi panel: ${err.message}`);
        delete userData[userId];
        return;
      }
      stream
        .on('close', (code, signal) => installWings(conn))
        .on('data', (data) => {
          const output = data.toString();
          console.log('Logger: ' + output);
          if (output.includes('Input 0-6')) stream.write('0\n');
          if (output.includes('(y/N)')) stream.write('y\n');
          if (output.includes('Database name')) stream.write('\n');
          if (output.includes('Database username')) stream.write('admin\n');
          if (output.includes('Password (press enter to use randomly generated password)')) stream.write('admin\n');
          if (output.includes('Select timezone')) stream.write('Asia/Jakarta\n');
          if (output.includes('Provide the email address')) stream.write('admin@gmail.com\n');
          if (output.includes('Email address for the initial admin account')) stream.write('admin@gmail.com\n');
          if (output.includes('Username for the initial admin account')) stream.write('admin\n');
          if (output.includes('First name')) stream.write('admin\n');
          if (output.includes('Last name')) stream.write('admin\n');
          if (output.includes('Password for the initial admin account')) stream.write(`${passwordPanel}\n`);
          if (output.includes('Set the FQDN of this panel')) stream.write(`${domainpanel}\n`);
          if (output.includes('Do you want to automatically configure UFW')) stream.write('y\n');
          if (output.includes('Do you want to automatically configure HTTPS')) stream.write('y\n');
          if (output.includes('Select the appropriate number [1-2]')) stream.write('1\n');
          if (output.includes('I agree that this HTTPS request')) stream.write('y\n');
          if (output.includes('Proceed anyways')) stream.write('y\n');
          if (output.includes('(yes/no)')) stream.write('y\n');
          if (output.includes('Initial configuration completed')) stream.write('y\n');
          if (output.includes('Still assume SSL')) stream.write('y\n');
          if (output.includes('Please read the Terms of Service')) stream.write('y\n');
          if (output.includes('(A)gree/(C)ancel:')) stream.write('A\n');
        })
        .stderr.on('data', (data) => console.log('STDERR: ' + data));
    });
  };

  // Mulai koneksi SSH
  ress.on('ready', () => {
    installPanel(ress);
  }).connect(connSettings);

  ress.on('error', (err) => {
    ctx.reply(`Gagal koneksi ke server: ${err.message}`);
    delete userData[userId];
  });
}

// Cloudflare API settings

// Perintah untuk menambahkan subdomain
bot.command('addsubdomain', async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (!text) {
    return ctx.reply(examplee());
  }

  const [subdomain, target] = text.split('|');
  if (!subdomain || !target) {
    return ctx.reply(examplee());
  }

  // Untuk kasus spesifik Anda: varrtzy.xyz
  const finalSubdomain = subdomain || 'varrtzy.xyz'; // Default ke varrtzy.xyz jika tidak ada input
  ctx.reply(`Memproses penambahan subdomain ${finalSubdomain}...`);

  // Tentukan tipe record (A atau CNAME) berdasarkan target
  const recordType = target.match(/^\d+\.\d+\.\d+\.\d+$/) ? 'A' : 'CNAME';
  const apiUrl = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        type: recordType,
        name: finalSubdomain,
        content: target,
        ttl: 1, // Auto TTL
        proxied: false, // Proxy melalui Cloudflare
      },
      {
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      ctx.reply(`Subdomain ${finalSubdomain}.varrtzy.xyz berhasil ditambahkan dengan ${recordType} record ke ${target}!`);
    } else {
      ctx.reply(`Gagal menambahkan subdomain: ${response.data.errors[0].message}`);
    }
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

// Jalankan bot
bot.launch(() => log("Encrypt Bot by VexxuzzZ berjalan..."));
process.on("unhandledRejection", (reason) => log("Unhandled Rejection", reason));

bot.command('payment', (ctx) => {
    ctx.replyWithPhoto(
        'https://files.catbox.moe/ytemk3.jpg', // Foto QRIS
        {
            caption: 'Silakan scan QRIS untuk pembayaran atau klik tombol di bawah untuk nomor e-wallet dan sertakan bukti berupa ss ke @VexxuzzZ:',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Dana', callback_data: 'show_dana' }],
                    [{ text: 'OVO', callback_data: 'show_ovo' }],
                    [{ text: 'GoPay', callback_data: 'show_gopay' }],
                ],
            },
        }
    );
});

const paymentNumber = '085770584801';

// Handle button clicks
bot.action('show_dana', (ctx) => ctx.reply(`Nomor Dana: ${paymentNumber}`));
bot.action('show_ovo', (ctx) => ctx.reply(`Nomor OVO: ${paymentNumber}`));
bot.action('show_gopay', (ctx) => ctx.reply(`Nomor GoPay: ${paymentNumber}`));




const { exec } = require('child_process');

bot.command('decrypt', (ctx) => {
    ctx.reply('Kirim file JavaScript yang ingin didecrypt.');
});

bot.on('document', async (ctx) => {
    const file = ctx.message.document;
    if (!file.file_name.endsWith('.js')) {
        return ctx.reply('Harap kirim file JavaScript (.js) untuk didecrypt.');
    }

    try {
        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        const filePath = path.join(__dirname, file.file_name);
        const decryptedPath = path.join(__dirname, `decrypted_${file.file_name}`);

        // Download file dari Telegram
        const res = await fetch(fileLink.href);
        const fileData = await res.buffer();
        fs.writeFileSync(filePath, fileData);

        // Jalankan WebCrack untuk mendekripsi
        exec(`npx webcrack ${filePath} -o ${decryptedPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return ctx.reply('Gagal mendekripsi file.');
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }

            // Kirim file hasil decrypt ke user
            ctx.replyWithDocument({ source: decryptedPath, filename: `decrypted_${file.file_name}` })
                .catch(err => console.error(err));

            // Hapus file setelah dikirim
            setTimeout(() => {
                fs.unlinkSync(filePath);
                fs.unlinkSync(decryptedPath);
            }, 5000);
        });

        ctx.reply('File sedang diproses, mohon tunggu...');

    } catch (error) {
        console.error(error);
        ctx.reply('Terjadi kesalahan saat memproses file.');
    }
});
