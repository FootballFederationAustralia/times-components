//
//  RNTBrightcoveVideoEventSignal.h
//  RNTBrightcove
//
//  Created by Beau Ayres on 5/4/18.
//  Copyright © 2018 Osedea. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNTBrightcoveVideoEventSignal : RCTEventEmitter <RCTBridgeModule>

-(void) onPlay;
-(void) onClose;

@end
