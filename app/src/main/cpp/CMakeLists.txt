cmake_minimum_required(VERSION 3.22.1)
project(discord_native LANGUAGES CXX)
add_library(discord_native SHARED native.cpp)
target_compile_features(discord_native PRIVATE cxx_std_23)
