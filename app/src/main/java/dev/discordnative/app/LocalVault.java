package dev.discordnative.app;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.ArrayList;
import java.util.List;

public final class LocalVault {
    private final SharedPreferences prefs;
    public LocalVault(Context context) {
        prefs = context.getSharedPreferences("nexus_private_drafts", Context.MODE_PRIVATE);
    }
    public void save(String text) {
        String safe = text == null ? "" : text;
        if (safe.length() > 10000) safe = safe.substring(0, 10000);
        prefs.edit().putString("draft", safe).apply();
    }
    public String load() { return prefs.getString("draft", ""); }
    public void clear() { prefs.edit().remove("draft").apply(); }
}
