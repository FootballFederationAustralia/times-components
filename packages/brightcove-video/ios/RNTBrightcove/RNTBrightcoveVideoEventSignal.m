//
//  RNTBrightcoveVideoEventSignal.m
//  RNTBrightcove
//
//  Created by Beau Ayres on 5/4/18.
//  Copyright © 2018 Osedea. All rights reserved.
//

#import "RNTBrightcoveVideoEventSignal.h"

@interface RNTBrightcoveVideoEventSignal ()
#define ONPLAYNOTIFICATION @"onPlayNotification"
#define ONCLOSENOTIFICATION @"onCloseNotification"
@end

@implementation RNTBrightcoveVideoEventSignal

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[ONPLAYNOTIFICATION, ONCLOSENOTIFICATION];
}

+ (id)allocWithZone:(NSZone *)zone {
  static RNTBrightcoveVideoEventSignal *sharedRNTBrightcoveVideoEventSignal = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedRNTBrightcoveVideoEventSignal = [super allocWithZone:zone];
  });
  return sharedRNTBrightcoveVideoEventSignal;
}

-(void)onPlay; {
  [self sendEventWithName:@"onPlayNotification" body:NULL];
}

-(void)onClose; {
  @try {
  [self sendEventWithName:@"onCloseNotification" body:NULL];
  } @catch (NSException *error) {
    NSLog(@"onClose was called after a live refresh, this could cause a crash if not caught");
  }
}

@end
