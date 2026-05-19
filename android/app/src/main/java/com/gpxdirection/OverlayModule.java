package com.gpxdirection;

import android.content.Intent;

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
        Intent intent = new Intent(context, OverlayService.class);
        intent.putExtra("text", text);

        context.startService(intent);
    }
}