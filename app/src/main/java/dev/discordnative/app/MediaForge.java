package dev.discordnative.app;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.net.Uri;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public final class MediaForge {
    private MediaForge() {}

    public static File renderCard(Context context, String message) throws IOException {
        int width = 1080, height = 1080;
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setShader(new LinearGradient(0, 0, width, height,
            new int[]{Color.rgb(13, 17, 38), Color.rgb(69, 35, 119), Color.rgb(16, 24, 47)},
            null, Shader.TileMode.CLAMP));
        canvas.drawRect(0, 0, width, height, p);
        p.setShader(null);
        p.setColor(Color.rgb(150, 132, 255));
        p.setStrokeWidth(5);
        p.setStyle(Paint.Style.STROKE);
        canvas.drawRoundRect(48, 48, 1032, 1032, 44, 44, p);
        p.setStyle(Paint.Style.FILL);
        p.setTypeface(Typeface.create("sans-serif-black", Typeface.BOLD));
        p.setTextSize(68);
        canvas.drawText("NEXUS  //  OMEGA", 92, 168, p);
        p.setColor(Color.rgb(200, 205, 240));
        p.setTextSize(30);
        canvas.drawText("REALITY ENGINE   •   MEDIAFORGE", 94, 223, p);
        p.setColor(Color.WHITE);
        p.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        p.setTextSize(48);
        String safe = message == null ? "" : message;
        int y = 355;
        for (String paragraph : safe.split("\\n", -1)) {
            StringBuilder line = new StringBuilder();
            for (String word : paragraph.split(" ")) {
                String candidate = line.length() == 0 ? word : line + " " + word;
                if (p.measureText(candidate) > 860 && line.length() > 0) {
                    canvas.drawText(line.toString(), 94, y, p);
                    y += 66;
                    line.setLength(0);
                    line.append(word);
                } else {
                    line.setLength(0);
                    line.append(candidate);
                }
                if (y > 860) break;
            }
            if (y > 860) break;
            canvas.drawText(line.toString(), 94, y, p);
            y += 76;
        }
        p.setColor(Color.rgb(173, 165, 255));
        p.setTextSize(29);
        canvas.drawText("CREATED WITH NEXUS", 94, 970, p);
        File directory = new File(context.getCacheDir(), "shared");
        if (!directory.exists() && !directory.mkdirs()) throw new IOException("Cannot create cache directory");
        File file = new File(directory, "nexus-card.png");
        try (FileOutputStream out = new FileOutputStream(file)) {
            if (!bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)) throw new IOException("PNG encoding failed");
        } finally {
            bitmap.recycle();
        }
        return file;
    }

    public static void shareCard(Context context, String message) throws IOException {
        File file = renderCard(context, message);
        Uri uri = FileProvider.getUriForFile(context, context.getPackageName() + ".files", file);
        Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("image/png");
        send.putExtra(Intent.EXTRA_STREAM, uri);
        send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        context.startActivity(Intent.createChooser(send, "Share NEXUS image to Discord"));
    }
}
