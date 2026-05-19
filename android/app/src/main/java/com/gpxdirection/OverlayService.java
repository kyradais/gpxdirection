package com.gpxdirection;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.IBinder;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.TextView;

public class OverlayService extends Service {

    WindowManager windowManager;
    TextView textView;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        String text = intent.getStringExtra("text");

        textView = new TextView(this);

        textView.setText(text);

        textView.setTextSize(24);

        windowManager =
            (WindowManager)getSystemService(WINDOW_SERVICE);

        WindowManager.LayoutParams params =
            new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
            );

        params.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;

        params.y = 200;

        windowManager.addView(textView, params);

        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}