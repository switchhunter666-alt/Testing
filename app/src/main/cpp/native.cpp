#include <jni.h>
#include <string>

extern "C" JNIEXPORT jstring JNICALL
Java_dev_discordnative_app_MainActivity_nativeStatus(JNIEnv* env, jclass) {
    const std::string status = "Native C++ core loaded.\nAndroid build pipeline ready.\nDiscord integration: not configured.";
    return env->NewStringUTF(status.c_str());
}
