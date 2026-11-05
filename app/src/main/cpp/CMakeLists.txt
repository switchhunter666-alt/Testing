cmake_minimum_required(VERSION 3.22.1)
project(discord_native LANGUAGES CXX)
add_library(discord_native SHARED native.cpp)
target_compile_features(discord_native PRIVATE cxx_std_23)

# NDK r27 defaults to 4 KiB ELF PT_LOAD alignment. Android devices with a
# 16 KiB kernel page size need this link alignment for reliable native loading.
if(ANDROID)
  target_link_options(discord_native PRIVATE
    "-Wl,-z,max-page-size=16384"
    "-Wl,-z,common-page-size=16384")
endif()
