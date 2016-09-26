package com.dailyreactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by zsj on 2016/9/22.
 */

public class RefreshEvent extends Event<RefreshEvent> {

    static final String EVENT_NAME = "topSwipeRefresh";

    public RefreshEvent(int viewTag, long timestampMs) {
        super(viewTag);
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public short getCoalescingKey() {
        return 0;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), Arguments.createMap());
    }
}