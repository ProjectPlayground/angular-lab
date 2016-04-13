import {provide} from 'angular2/core';
import {Http} from 'angular2/http';
import {MdLiveAnnouncer} from '@angular2-material/core/live-announcer/live-announcer';

import {AuthClient} from './services/auth';
import {Chores} from './services/chores';
import {FIREBASE_APP_LINK, FIREBASE_CHORES_PATH} from './common/constants';
import {Icon} from './services/icon';
import {Tracker} from './services/tracker';
import {User} from './services/user';

export {MdLiveAnnouncer} from '@angular2-material/core/live-announcer/live-announcer';
export * from './services/auth';
export * from './services/chores';
export * from './common/constants';
export * from './services/icon';
export * from './services/tracker';
export * from './services/user';

export const SERVICES_PROVIDERS: Array<any> = [
	provide(MdLiveAnnouncer, {
		useClass: MdLiveAnnouncer
	}),
	provide(Chores, {
		useFactory: (promise: Promise<User>) => {
			return new Promise((resolve) => {
				return promise.then((user: User) => resolve(
					new Chores(
						new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_CHORES_PATH}/${user.key}`)
					)
				));
			});
		},
		deps: [
			User
		]
	}),
	provide(User, {
		useFactory: (client: AuthClient) => {
			// Authenticate Firebase and then create/get the user based on the key/email returned from Firebase after auth
			return new Promise((resolve) => {
				let subscription = client.session.subscribe((auth: FirebaseAuthData) => {
					if (auth !== null) {
						let up = User.fromAuth(auth);
						up.then((user: User) => {
							subscription.unsubscribe();
							resolve(user);
						});
					}
				});
			});
		},
		deps: [
			AuthClient
		]
	}),
	provide(AuthClient, {
		useFactory: () => {
			return new AuthClient();
		}
	}),
	provide(Icon, {
		useFactory: (http: Http) => {
			return new Icon(http);
		},
		deps: [
			Http
		]
	}),
	provide(Tracker, {
		useFactory: () => {
			return new Tracker();
		}
	})
];
