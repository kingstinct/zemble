// original: https://github.com/henhal/apns-types/blob/main/src/index.ts

// Types generated from specifications at https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification
// and https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html

type NumericFlag = 0 | 1;

/**
 * An APS alert dictionary
 */
export interface ApsAlert {
  /**
   * The title of the notification. Apple Watch displays this string in the short look notification interface.
   * Specify a string that’s quickly understood by the user.
   */
  readonly title?: string
  /**
   * Additional information that explains the purpose of the notification.
   */
  readonly subtitle?: string;
  /**
   * The content of the alert message.
   */
  readonly body?: string;
  /**
   * The name of the launch image file to display. If the user chooses to launch your app,
   * the contents of the specified image or storyboard file are displayed instead of your app’s normal launch image.
   */
  readonly 'launch-image'?: string;
  /**
   * The key for a localized title string. Specify this key instead of the title key to retrieve the title from your
   * app’s Localizable.strings files. The value must contain the name of a key in your strings file.
   */
  readonly 'title-loc-key'?: string;
  /**
   * An array of strings containing replacement values for variables in your title string.
   * Each %@ character in the string specified by the title-loc-key is replaced by a value from this array.
   * The first item in the array replaces the first instance of the %@ character in the string,
   * the second item replaces the second instance, and so on.
   */
  readonly 'title-loc-args'?: readonly string[];
  /**
   * The key for a localized subtitle string. Use this key, instead of the subtitle key, to retrieve the subtitle
   * from your app’s Localizable.strings file. The value must contain the name of a key in your strings file.
   */
  readonly 'subtitle-loc-key'?: string;
  /**
   * An array of strings containing replacement values for variables in your title string. Each %@ character in the
   * string specified by subtitle-loc-key is replaced by a value from this array. The first item in the array
   * replaces the first instance of the %@ character in the string, the second item replaces the second instance,
   * and so on.
   */
  readonly 'subtitle-loc-args'?: readonly string[];
  /**
   * The key for a localized message string. Use this key, instead of the body key, to retrieve the message text
   * from your app’s Localizable.strings file. The value must contain the name of a key in your strings file.
   */
  readonly 'loc-key'?: string;
  /**
   * An array of strings containing replacement values for variables in your message text. Each %@ character in the
   * string specified by loc-key is replaced by a value from this array. The first item in the array replaces the
   * first instance of the %@ character in the string, the second item replaces the second instance, and so on.
   */
  readonly 'loc-args'?: readonly string[];

  /**
   * @deprecated
   */
  readonly 'action-loc-key'?: string;

  /**
   * @deprecated
   */
  readonly action?: string;
}

/**
 * An APS sound dictionary
 */
export interface ApsSound {
  /**
   * The critical alert flag. Set to 1 to enable the critical alert.
   */
  readonly critical?: NumericFlag;
  /**
   *  The name of a sound file in your app’s main bundle or in the Library/Sounds folder of your app’s container
   *  directory. Specify the string 'default' to play the system sound.
   */
  readonly name?: 'default' | string;
  /**
   * The volume for the critical alert’s sound. Set this to a value between 0 (silent) and 1 (full volume).
   */
  readonly volume?: number;
}

/**
 * An APS dictionary
 */
export interface Aps {
  /**
   * The information for displaying an alert. A dictionary is recommended. If you specify a string, the alert displays
   * your string as the body text.
   */
  readonly alert?: string | ApsAlert;
  /**
   * The number to display in a badge on your app’s icon. Specify 0 to remove the current badge, if any.
   */
  readonly badge?: number;
  /**
   * If a string: The name of a sound file in your app’s main bundle or in the Library/Sounds folder of your app’s
   * container directory. Specify the string 'default' to play the system sound. Use this key for regular
   * notifications.
   * For critical alerts, use the sound dictionary instead.
   */
  readonly sound?: string | ApsSound;
  /**
   * An app-specific identifier for grouping related notifications. This value corresponds to the threadIdentifier
   * property in the UNNotificationContent object.
   */
  readonly 'thread-id'?: string;
  /**
   * The notification’s type. This string must correspond to the identifier of one of the UNNotificationCategory
   * objects you register at launch time. See Declaring your actionable notification types.
   */
  readonly category?: string;
  /**
   * The background notification flag. To perform a silent background update, specify the value 1 and don’t
   * include the alert, badge, or sound keys in your payload.
   */
  readonly 'content-available'?: NumericFlag;
  /**
   * The notification service app extension flag. If the value is 1, the system passes the notification
   * to your notification service app extension before delivery.
   * Use your extension to modify the notification’s content. See Modifying content in newly delivered notifications.
   */
  readonly 'mutable-content'?: NumericFlag;
  /**
   * The identifier of the window brought forward. The value of this key will be populated on the
   * UNNotificationContent object created from the push payload. Access the value using the UNNotificationContent
   * object’s targetContentIdentifier property.
   */
  readonly 'target-content-id'?: string
  /**
   * The importance and delivery timing of a notification. The string values “passive”, “active”, “time-sensitive”,
   * or “critical” correspond to the UNNotificationInterruptionLevel enumeration cases.
   */
  readonly 'interruption-level'?: 'passive' | 'active' | 'time-sensitive' | 'critical';
  /**
   * The relevance score, a number between 0 and 1, that the system uses to sort the notifications from your app.
   * The highest score gets featured in the notification summary. See relevanceScore.
   * If your remote notification updates a Live Activity, you can set any Double value; for example, 25, 50, 75, or 100.
   */
  readonly 'relevance-score'?: number
  /**
   * The criteria the system evaluates to determine if it displays the notification in the current Focus.
   */
  readonly 'filter-criteria'?: string
  /**
   * The UNIX timestamp that represents the date at which a Live Activity becomes stale, or out of date.
   */
  readonly 'stale-date'?: number
  /**
   * The updated or final content for a Live Activity. The content of this dictionary must match the data you
   * describe with your custom ActivityAttributes implementation.
   */
  readonly 'content-state'?: Record<string, unknown>;
  /**
   * The UNIX timestamp that marks the time when you send the remote notification that updates or ends a Live Activity.
   */
  readonly timestamp?: number
  /**
   * The string that describes whether you update or end an ongoing Live Activity with the remote push notification.
   */
  readonly events?: 'update' | 'end';
}

export type APNSError =
  | { readonly code: 400, readonly error: 'BadCollapseId', readonly description: 'The collapse identifier exceeds the maximum allowed size.' }
  | { readonly code: 400, readonly error: 'BadDeviceToken', readonly description: 'The specified device token is invalid. Verify that the request contains a valid token and that the token matches the environment.' }
  | { readonly code: 400, readonly error: 'BadExpirationDate', readonly description: 'The apns-expiration value is invalid.' }
  | { readonly code: 400, readonly error: 'BadMessageId', readonly description: 'The apns-id value is invalid.' }
  | { readonly code: 400, readonly error: 'BadPriority', readonly description: 'The apns-priority value is invalid.' }
  | { readonly code: 400, readonly error: 'BadTopic', readonly description: 'The apns-topic value is invalid.' }
  | { readonly code: 400, readonly error: 'DeviceTokenNotForTopic', readonly description: 'The device token doesn’t match the specified topic.' }
  | { readonly code: 400, readonly error: 'DuplicateHeaders', readonly description: 'One or more headers are repeated.' }
  | { readonly code: 400, readonly error: 'IdleTimeout', readonly description: 'Idle timeout.' }
  | { readonly code: 400, readonly error: 'InvalidPushType', readonly description: 'The apns-push-type value is invalid.' }
  | { readonly code: 400, readonly error: 'MissingDeviceToken', readonly description: 'The device token isn’t specified in the request :path. Verify that the :path header contains the device token.' }
  | { readonly code: 400, readonly error: 'MissingTopic', readonly description: 'The apns-topic header of the request isn’t specified and is required. The apns-topic header is mandatory when the client is connected using a certificate that supports multiple topics.' }
  | { readonly code: 400, readonly error: 'PayloadEmpty', readonly description: 'The message payload is empty.' }
  | { readonly code: 400, readonly error: 'TopicDisallowed', readonly description: 'Pushing to this topic is not allowed.' }
  | { readonly code: 403, readonly error: 'BadCertificate', readonly description: 'The certificate is invalid.' }
  | { readonly code: 403, readonly error: 'BadCertificateEnvironment', readonly description: 'The client certificate is for the wrong environment.' }
  | { readonly code: 403, readonly error: 'ExpiredProviderToken', readonly description: 'The provider token is stale and a new token should be generated.' }
  | { readonly code: 403, readonly error: 'Forbidden', readonly description: 'The specified action is not allowed.' }
  | { readonly code: 403, readonly error: 'InvalidProviderToken', readonly description: 'The provider token is not valid, or the token signature can’t be verified.' }
  | { readonly code: 403, readonly error: 'MissingProviderToken', readonly description: 'No provider certificate was used to connect to APNs, and the authorization header is missing or no provider token is specified.' }
  | { readonly code: 404, readonly error: 'BadPath', readonly description: 'The request contained an invalid :path value.' }
  | { readonly code: 405, readonly error: 'MethodNotAllowed', readonly description: 'The specified :method value isn’t POST.' }
  | { readonly code: 410, readonly error: 'ExpiredToken', readonly description: 'The device token has expired.' }
  | { readonly code: 410, readonly error: 'Unregistered', readonly description: 'The device token is inactive for the specified topic. There is no need to send further pushes to the same device token, unless your application retrieves the same device token, see Registering your app with APNs' }
  | { readonly code: 413, readonly error: 'PayloadTooLarge', readonly description: 'The message payload is too large. For information about the allowed payload size, see Create a POST request to APNs in Sending notification requests to APNs.' }
  | { readonly code: 429, readonly error: 'TooManyProviderTokenUpdates', readonly description: 'The provider’s authentication token is being updated too often. Update the authentication token no more than once every 20 minutes.' }
  | { readonly code: 429, readonly error: 'TooManyRequests', readonly description: 'Too many requests were made consecutively to the same device token.' }
  | { readonly code: 500, readonly error: 'InternalServerError', readonly description: 'An internal server error occurred.' }
  | { readonly code: 503, readonly error: 'ServiceUnavailable', readonly description: 'The service is unavailable.' }
  | { readonly code: 503, readonly error: 'Shutdown', readonly description: 'The APNs server is shutting down.' };
