package com.gpxdirection;

import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OverlayModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context;

    OverlayModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "OverlayModule";
    }

    @ReactMethod
    public void startOverlay(String text) {

        Log.d("GPXDIRECTION", "startOverlay called");

        try {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

                boolean canDraw =
                    Settings.canDrawOverlays(context);

                Log.d(
                    "GPXDIRECTION",
                    "CAN DRAW OVERLAY = " + canDraw
                );

                if (!canDraw) {

                    Log.d(
                        "GPXDIRECTION",
                        "NO OVERLAY PERMISSION"
                    );

                    return;
                }
            }

            Intent intent =
                new Intent(context, OverlayService.class);

            intent.putExtra("text", text);

            context.startService(intent);

            Log.d(
                "GPXDIRECTION",
                "SERVICE STARTED"
            );

        } catch (Exception e) {

            Log.d(
                "GPXDIRECTION",
                "SERVICE ERROR = " + e
            );

        }
    }
}