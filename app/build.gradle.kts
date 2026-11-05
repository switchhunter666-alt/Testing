plugins { id("com.android.application") }

android {
    namespace = "dev.discordnative.app"
    compileSdk = (System.getenv("ANDROID_COMPILE_API") ?: "35").toInt()

    defaultConfig {
        applicationId = "dev.discordnative.app"
        minSdk = 26
        targetSdk = (System.getenv("ANDROID_COMPILE_API") ?: "35").toInt()
        versionCode = 1
        versionName = "0.1.0"
        externalNativeBuild { cmake { cppFlags += listOf("-std=c++2c", "-Wall", "-Wextra") } }
    }
    externalNativeBuild { cmake { path = file("src/main/cpp/CMakeLists.txt") } }
    buildTypes { getByName("release") { isMinifyEnabled = false } }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}
