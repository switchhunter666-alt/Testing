#include <jni.h>
#include <string>
#include <vector>
#include <algorithm>
#include <cstdint>

namespace {
std::string readUtf8(JNIEnv* env, jstring source) {
    if (!source) return {};
    const char* ptr = env->GetStringUTFChars(source, nullptr);
    if (!ptr) return {};
    std::string value(ptr);
    env->ReleaseStringUTFChars(source, ptr);
    return value;
}
std::vector<std::string> codepoints(const std::string& input) {
    std::vector<std::string> result;
    for (size_t i = 0; i < input.size();) {
        unsigned char c = static_cast<unsigned char>(input[i]);
        size_t n = c < 0x80 ? 1 : (c < 0xE0 ? 2 : (c < 0xF0 ? 3 : 4));
        n = std::min(n, input.size() - i);
        result.push_back(input.substr(i, n));
        i += n;
    }
    return result;
}
std::string encode(uint32_t c) {
    if (c < 0x80) return std::string(1, static_cast<char>(c));
    if (c < 0x800) return {static_cast<char>(0xC0 | (c >> 6)), static_cast<char>(0x80 | (c & 63))};
    if (c < 0x10000) return {static_cast<char>(0xE0 | (c >> 12)), static_cast<char>(0x80 | ((c >> 6) & 63)), static_cast<char>(0x80 | (c & 63))};
    return {static_cast<char>(0xF0 | (c >> 18)), static_cast<char>(0x80 | ((c >> 12) & 63)), static_cast<char>(0x80 | ((c >> 6) & 63)), static_cast<char>(0x80 | (c & 63))};
}
std::string escapeMarkdown(const std::string& input) {
    std::string out;
    for (char c : input) {
        if (c == '*' || c == '_' || c == '~' || c == '|' || c == '\\' || c == '`') out += '\\';
        out += c;
    }
    return out;
}
std::string transformText(const std::string& input, int mode) {
    switch (mode) {
        case 1: return "**" + escapeMarkdown(input) + "**";
        case 2: {
            std::string out = "> ";
            for (char c : input) { out += c; if (c == '\n') out += "> "; }
            return out;
        }
        case 3: return "```\n" + input + "\n```";
        case 4: return "||" + escapeMarkdown(input) + "||";
        case 5: {
            std::string out;
            for (unsigned char c : input) {
                if (c >= 33 && c <= 126) out += encode(0xFF01 + c - 33);
                else if (c == ' ') out += encode(0x3000);
                else out += static_cast<char>(c);
            }
            return out;
        }
        case 6: {
            std::string out; size_t index = 0;
            for (const auto& cp : codepoints(input)) {
                out += cp;
                if (cp != " " && cp != "\n" && index++ % 3 == 0) out += encode(0x0338);
            }
            return out;
        }
        case 7: {
            auto chars = codepoints(input);
            std::reverse(chars.begin(), chars.end());
            std::string out;
            for (const auto& cp : chars) out += cp;
            return out;
        }
        case 8: return "╔════════════╗\n" + input + "\n╚════════════╝";
        case 9: return "✦ N E X U S ✦\n" + input + "\n✦ ━━━━━━━━━ ✦";
        default: return input;
    }
}
}
extern "C" JNIEXPORT jstring JNICALL
Java_dev_discordnative_app_MainActivity_nativeStatus(JNIEnv* env, jclass) {
    return env->NewStringUTF("NEXUS OMEGA • Native creative engine ready");
}
extern "C" JNIEXPORT jstring JNICALL
Java_dev_discordnative_app_MainActivity_transform(JNIEnv* env, jclass, jstring input, jint mode) {
    std::string result = transformText(readUtf8(env, input), mode);
    return env->NewStringUTF(result.c_str());
}
