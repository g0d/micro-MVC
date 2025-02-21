/*
    Main JS

    File name: main.js
    Description: This file contains the main js code for all views.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2021
    Open Software License (OSL 3.0)
*/

var global_labels = new yoda();

var global_m_mvc_dynamic_contents = {
                                        "en"    :   [
                                                        { "m_mvc"               :   "micro-MVC" },
                                                        { "close_button"        :   "Close" },
                                                        { "email_inv"           :   "The e-mail format is invalid!" },
                                                        { "credentials_cmplx"   :   "Please choose more complex credentials!" },
                                                        { "credentials_inv"     :   "Credentials are invalid!" },
                                                        { "credentials_wrg"     :   "Your credentials are wrong!" },
                                                        { "passwd_confirm"      :   "Password confirmation failed!" },
                                                        { "session_lost"        :   "Your session has been terminated!" },
                                                        { "reg_success"         :   "Registration succeeded!" },
                                                        { "reg_fail"            :   "Registration failed!" },
                                                        { "logout_error"        :   "Logout was impossible!" }
                                                    ],
                                        "gr"    :   [
                                                        { "m_mvc"               :   "micro-MVC" },
                                                        { "close_button"        :   "Κλείσε" },
                                                        { "email_inv"           :   "Μη έγκυρο e-mail!" },
                                                        { "credentials_cmplx"   :   "Παρακαλώ επιλέξτε πιο σύνθετα στοιχεία πρόσβασης!" },
                                                        { "credentials_inv"     :   "Τα στοιχεία πρόσβασης είναι άκυρα!" },
                                                        { "credentials_wrg"     :   "Τα στοιχεία πρόσβασης είναι λάθος!" },
                                                        { "passwd_confirm"      :   "Αποτυχία επαλήθευσης πεδίου κωδικού!" },
                                                        { "session_lost"        :   "Διεκόπη η σύνδεση με το σύστημα!" },
                                                        { "reg_success"         :   "Η εγγραφή ήταν επιτυχής!" },
                                                        { "reg_fail"            :   "Η εγγραφή ήταν ανεπιτυχής!" },
                                                        { "logout_error"        :   "Δεν ήταν δυνατή η αποσύνδεση!" }
                                                    ]
                                    };

// Progammatic way to create the JSON config above
/*
global_labels.init(['en', 'gr']);
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "m_mvc" : "micro-MVC" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "close" : "Close" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "email_inv" : "The email format is invalid!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "credentials_cmplx" : "Please choose more complex credentials!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "credentials_inv" : "Credentials are invalid!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "credentials_wrg" : "Your credentials are wrong!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "passwd_confirm" : "Password confirmation failed!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "session_lost" : "Your session has been terminated!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "reg_success" : "Registration succeeded!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "reg_fail" : "Registration failed!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'en', { "logout_error" : "Logout was impossible!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "m_mvc" : "micro-MVC" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "close" : "Κλείσε" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "email_inv" : "Μη έγκυρο e-mail!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "credentials_cmplx" : "Παρακαλώ επιλέξτε πιο σύνθετα στοιχεία πρόσβασης!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "credentials_inv" : "Τα στοιχεία πρόσβασης είναι άκυρα!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "credentials_wrg" : "Τα στοιχεία πρόσβασης είναι λάθος!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "passwd_confirm" : "Αποτυχία επαλήθευσης πεδίου κωδικού!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "session_lost" : "Διεκόπη η σύνδεση με το σύστημα!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "reg_success" : "Η εγγραφή ήταν επιτυχής!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "reg_fail" : "Η εγγραφή ήταν ανεπιτυχής!" });
global_m_mvc_dynamic_contents = global_labels.set(global_m_mvc_dynamic_contents, 'gr', { "logout_error" : "Δεν ήταν δυνατή η αποσύνδεση!" });
*/
