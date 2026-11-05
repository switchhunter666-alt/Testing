#include <jni.h>
#include <string>
#include <algorithm>

namespace {
std::string fromJava(JNIEnv* env, jstring s) {
    if (!s) return {};
    const char* raw = env->GetStringUTFChars(s, nullptr);
    if (!raw) return {};
    std::string out(raw);
    env->ReleaseStringUTFChars(s, raw);
    return out;
}
std::string transformText(const std::string& input, int mode) {
    switch (mode) {
        case 1: return "**" + input + "**";
        case 2: {
            std::string result = "> ";
            for (char c : input) {
                result += c;
                if (c == '\n') result += "> ";
            }
            return result;
        }
        case 3: return "```\n" + input + "\n```";
        case 4: return "||" + input + "||";
        default: return input;
    }
}
}
extern "C" JNIEXPORT jstring JNICALL
Java_dev_discordnative_app_MainActivity_nativeStatus(JNIEnv* env, jclass) {
    return env->NewStringUTF("Native C++ engine online | Local transformations enabled");
}
extern "C" JNIEXPORT jstring JNICALL
Java_dev_discordnative_app_MainActivity_transform(JNIEnv* env, jclass, jstring input, jint mode) {
    const auto output = transformText(fromJava(env, input), mode);
    return env->NewStringUTF(output.c_str());
}
