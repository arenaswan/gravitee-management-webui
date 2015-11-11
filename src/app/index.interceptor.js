/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function interceptorConfig ($httpProvider) {
  'ngInject';
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  var interceptorUnauthorized = ['$location', '$q', '$injector', function($location, $q, $injector) {
    return {
      responseError: function (error) {
        var unauthorizedError = !error || error.status === 401;
        var isLoginPage = '/login' === $location.$$path;

        $injector.get('NotificationService').error(error, unauthorizedError && isLoginPage ? 'Wrong user or password!' : '');
        if (unauthorizedError && !isLoginPage) {
          $location.path('/login');
        }

        return $q.reject(error);
      }
    };
  }];
  if ($httpProvider.interceptors) {
    $httpProvider.interceptors.push(interceptorUnauthorized);
  }
}

export default interceptorConfig;