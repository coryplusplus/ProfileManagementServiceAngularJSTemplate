(function () {

    console.log("running urlService");
    var app = angular.module("ProfileManagement.services");

    var urlService = function ($http) {
        prod_endpoint = "http://localhost:8080"
        sandbox_endpoint = "http://api.develop.cloudconfidant.com"
        baseUrl = prod_endpoint + "/profileManagementService/webapi/v1/"
        customerURL = baseUrl + "customers"
        authenticateCustomerUrl = baseUrl + "password/customer"
        authenticateUserUrl = baseUrl + "password"
        requestTokenURL = baseUrl + "token/"
        requestSingleUseToken = baseUrl + "token/single-use"
        profileURL = baseUrl + "profiles"
        messageURL = baseUrl + "messages"
        questions = baseUrl + "security/questions"
        answers = baseUrl + "security/answers"
        bugs = baseUrl + "bugs"
        payments = baseUrl + "payments"
        subscriptions = payments + "/subscription"
        card = payments + "/card"
        contactsURL = baseUrl + "contacts"


        var getContactsURL = function() {
            return contactsURL;
        }
        var getSingleUseToken = function() {
            return requestSingleUseToken;
        }
        var getCardURL = function () {
            return card;
        }
        var getSubscriptionURL = function () {
            return subscriptions;
        }
        var getPaymentsURL = function () {
            return payments;
        }
        var getBugsURL = function () {
            return bugs;
        }
        var getQuestionsURL = function () {
            return questions;
        }

        var getAnswersURL = function () {
            return answers
        }

        var getCustomersURL = function () {
            return customerURL;
        }
        var getCustomerCreateURL = function () {
            return customerURL;
        }

        var getCustomerAuthenticateURL = function () {
            return authenticateCustomerUrl;
        }

        var getRequestTokenURL = function () {
            return requestTokenURL
        }

        var getProfileURL = function () {
            return profileURL
        }

        var getMessageURL = function () {
            return messageURL
        }
        
        var getProdEndpoint = function () {
            return prod_endpoint
        }
        
        var getSandboxEndpoint = function () {
            return sandbox_endpoint
        }
        
        var getAuthenticateUserURL = function () {
            return authenticateUserUrl
        }

        return {
            getCustomerCreateURL: getCustomerCreateURL,
            getCustomersURL: getCustomersURL,
            getCustomerAuthenticateURL: getCustomerAuthenticateURL,
            getRequestTokenURL: getRequestTokenURL,
            getProfilesURL: getProfileURL,
            getMessageURL: getMessageURL,
            getAnswersURL: getAnswersURL,
            getQuestionsURL: getQuestionsURL,
            getBugsURL: getBugsURL,
            getPaymentsURL: getPaymentsURL,
            getSubscriptionURL: getSubscriptionURL,
            getCardURL: getCardURL,
            getProdEndpoint: getProdEndpoint,
            getSandboxEndpoint: getSandboxEndpoint,
            getSingleUseToken:getSingleUseToken,
            getContactsURL:getContactsURL,
            getAuthenticateUserURL:getAuthenticateUserURL,
        };
    };

    app.service("urlService", urlService);

})();