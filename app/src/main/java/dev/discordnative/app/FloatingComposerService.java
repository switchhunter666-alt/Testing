package dev.discordnative.app;

import android.app.Service;
import android.content.Intent;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.IBinder;
import android.provider.Settings;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

public final class FloatingComposerService extends Service {
    private WindowManager manager;
    private LinearLayout panel;
    private WindowManager.LayoutParams params;
    private static native String transform(String input, int mode);
    static { System.loadLibrary("discord_native"); }

    @Override public IBinder onBind(Intent intent) { return null; }
    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (!Settings.canDrawOverlays(this)) { stopSelf(); return START_NOT_STICKY; }
        if (panel != null) return START_NOT_STICKY;
        manager = (WindowManager) getSystemService(WINDOW_SERVICE);
        params = new WindowManager.LayoutParams(
            (int)(300 * getResources().getDisplayMetrics().density),
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT);
        params.gravity = Gravity.TOP | Gravity.START;
        params.x = 24; params.y = 140;
        panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setPadding(18, 14, 18, 14);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.rgb(25, 29, 49));
        bg.setCornerRadius(26);
        panel.setBackground(bg);
        TextView header = new TextView(this);
        header.setText("⠿  NEXUS FLOAT  •  Drag here");
        header.setTextColor(Color.WHITE);
        header.setTextSize(16);
        header.setPadding(8, 10, 8, 14);
        panel.addView(header);
        header.setOnTouchListener(new android.view.View.OnTouchListener() {
            int initialX, initialY; float downX, downY;
            @Override public boolean onTouch(android.view.View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x; initialY = params.y;
                        downX = event.getRawX(); downY = event.getRawY(); return true;
                    case MotionEvent.ACTION_MOVE:
                        params.x = initialX + (int)(event.getRawX() - downX);
                        params.y = initialY + (int)(event.getRawY() - downY);
                        manager.updateViewLayout(panel, params); return true;
                    default: return true;
                }
            }
        });
        EditText input = new EditText(this);
        input.setTextColor(Color.WHITE);
        input.setHintTextColor(Color.LTGRAY);
        input.setHint("Compose while Discord is open...");
        input.setMinLines(2);
        panel.addView(input);
        final int[] mode = {0};
        Button effect = new Button(this);
        effect.setText("Effect: Plain");
        panel.addView(effect);
        String[] names = {"Plain","Bold","Quote","Code","Spoiler","Fullwidth","Glitch","Reverse","Frame","NEXUS"};
        effect.setOnClickListener(v -> { mode[0] = (mode[0] + 1) % names.length; effect.setText("Effect: " + names[mode[0]]); });
        Button copy = new Button(this);
        copy.setText("Copy for Discord");
        panel.addView(copy);
        copy.setOnClickListener(v -> {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            clipboard.setPrimaryClip(ClipData.newPlainText("NEXUS", transform(input.getText().toString(), mode[0])));
            android.widget.Toast.makeText(this, "Copied — paste into Discord", android.widget.Toast.LENGTH_SHORT).show();
        });
        Button close = new Button(this);
        close.setText("Close floating editor");
        panel.addView(close);
        close.setOnClickListener(v -> stopSelf());
        manager.addView(panel, params);
        return START_NOT_STICKY;
    }
    @Override public void onDestroy() {
        if (manager != null && panel != null) manager.removeView(panel);
        panel = null;
        super.onDestroy();
    }
}
