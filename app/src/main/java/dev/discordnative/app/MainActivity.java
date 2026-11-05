package dev.discordnative.app;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

public final class MainActivity extends Activity {
    static { System.loadLibrary("discord_native"); }
    private static native String nativeStatus();

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(32, 32, 32, 32);
        layout.setBackgroundColor(Color.rgb(20, 22, 32));
        TextView heading = new TextView(this);
        heading.setText("Discord Native Lab");
        heading.setTextColor(Color.WHITE);
        heading.setTextSize(27);
        heading.setGravity(Gravity.CENTER);
        layout.addView(heading);
        TextView status = new TextView(this);
        status.setText(nativeStatus());
        status.setTextColor(Color.rgb(170, 185, 255));
        status.setTextSize(16);
        status.setGravity(Gravity.CENTER);
        status.setPadding(0, 28, 0, 0);
        layout.addView(status);
        setContentView(layout);
    }
}
