package com.dailyreactnative;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

/**
 * @author zsj
 */

public class AndroidShareModule extends ReactContextBaseJavaModule {

    public AndroidShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AndroidShare";
    }

    @ReactMethod
    public void share(final String title, final String url) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.putExtra(Intent.EXTRA_TEXT, title + " (share by Daily App) " + url);
                shareIntent.setType("text/plain");
                Activity currentActivity = getCurrentActivity();
                if (currentActivity != null) {
                    currentActivity.startActivity(Intent.createChooser(
                            shareIntent, "share"));
                } else {
                    getReactApplicationContext().startActivity(Intent.createChooser(
                            shareIntent, "share"));
                }
            }
        });
    }

}
