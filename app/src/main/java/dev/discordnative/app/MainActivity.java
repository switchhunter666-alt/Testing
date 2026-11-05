package dev.discordnative.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

public final class MainActivity extends Activity {
    static { System.loadLibrary("discord_native"); }
    private static native String nativeStatus();
    private static native String transform(String input, int mode);

    private final int background = Color.rgb(13, 16, 26);
    private final int panel = Color.rgb(27, 32, 49);
    private final int accent = Color.rgb(113, 104, 255);
    private EditText composer;
    private TextView preview;
    private int mode = 0;

    private GradientDrawable shape(int color) {
        GradientDrawable d = new GradientDrawable();
        d.setColor(color);
        d.setCornerRadius(22);
        return d;
    }
    private TextView text(String value, int size, int color) {
        TextView t = new TextView(this);
        t.setText(value);
        t.setTextSize(size);
        t.setTextColor(color);
        t.setPadding(16, 14, 16, 14);
        return t;
    }
    private void addButton(LinearLayout parent, String label, Runnable action) {
        Button b = new Button(this);
        b.setText(label);
        b.setAllCaps(false);
        b.setTextColor(Color.WHITE);
        b.setBackground(shape(accent));
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2);
        p.setMargins(0, 8, 0, 8);
        parent.addView(b, p);
        b.setOnClickListener(v -> action.run());
    }
    private void updatePreview() {
        preview.setText(transform(composer.getText().toString(), mode));
    }
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(background);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(24, 32, 24, 32);
        scroll.addView(root);

        TextView heading = text("NEXUS // Discord Native Lab", 25, Color.WHITE);
        heading.setTypeface(null, Typeface.BOLD);
        root.addView(heading);
        root.addView(text("ANDROID NATIVE • C++ CORE • COMPOSER LAB", 12, Color.rgb(160, 168, 200)));
        root.addView(text(nativeStatus(), 13, Color.rgb(170, 190, 255)));

        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(16, 16, 16, 16);
        box.setBackground(shape(panel));
        LinearLayout.LayoutParams bp = new LinearLayout.LayoutParams(-1, -2);
        bp.setMargins(0, 20, 0, 12);
        root.addView(box, bp);

        box.addView(text("MESSAGE TRANSFORMATION ENGINE", 16, Color.WHITE));
        composer = new EditText(this);
        composer.setTextColor(Color.WHITE);
        composer.setHintTextColor(Color.GRAY);
        composer.setHint("Write a message to transform...");
        composer.setMinLines(3);
        composer.setGravity(Gravity.TOP);
        composer.setText("Hello from Nexus!");
        box.addView(composer);

        addButton(box, "Plain", () -> { mode = 0; updatePreview(); });
        addButton(box, "Bold Markdown", () -> { mode = 1; updatePreview(); });
        addButton(box, "Quote Block", () -> { mode = 2; updatePreview(); });
        addButton(box, "Code Block", () -> { mode = 3; updatePreview(); });
        addButton(box, "Spoiler", () -> { mode = 4; updatePreview(); });

        box.addView(text("OUTPUT PREVIEW", 13, Color.rgb(175, 185, 220)));
        preview = text("", 16, Color.WHITE);
        preview.setBackground(shape(background));
        box.addView(preview);
        updatePreview();

        addButton(root, "Share transformed message", () -> {
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("text/plain");
            send.putExtra(Intent.EXTRA_TEXT, transform(composer.getText().toString(), mode));
            startActivity(Intent.createChooser(send, "Share message"));
        });
        addButton(root, "Copy output", () -> {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            clipboard.setPrimaryClip(android.content.ClipData.newPlainText("Nexus output", transform(composer.getText().toString(), mode)));
            Toast.makeText(this, "Copied", Toast.LENGTH_SHORT).show();
        });
        root.addView(text("This build transforms outgoing text locally. Direct Discord API posting requires OAuth2 or a separately hosted authorized bot. No user tokens are collected.", 12, Color.rgb(170, 180, 205)));
        setContentView(scroll);
    }
}
