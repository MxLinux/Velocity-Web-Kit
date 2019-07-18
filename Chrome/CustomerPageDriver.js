/* Global Variables */
var vCUSTOMERHEADER, vBILLINGSUMMARY, vACCOUNTBALANCE, vCUSTOMERCOMMS;
var CUSTOMER, LOCATION, USERNAME;
var SQLDateFormat = 'YYYY-MM-DD HH:mm:ss';
var NumberThresholds = [6,7,8];
var FontSizeClasses = ['small1','small2'];
var popupSettings = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=800,height=450,left=40,top=50';

$(document).ready(function () {
    InitVues();
    DatabindAccountNumber();

    QueryServe.initialize({
        QueryServeWebServiceURL:
            'http://eusvr41/QueryServe/v1/'
    });

    Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'Roboto'
            }
        }
    });
    GetWidgetData();
});

function DatabindAccountNumber() {

    LOCATION = getParameterByName('Location');
    CUSTOMER = getParameterByName('Customer');
    USERNAME = $('#hf_Username').val();

    if (LOCATION === '' || CUSTOMER === '' || LOCATION === null || CUSTOMER === null) {
        // Default Parameters for testing | Default: 000052-510001
        LOCATION = '000052';
        CUSTOMER = '510001';
    }

    vCUSTOMERHEADER.Customer = CUSTOMER;
    vCUSTOMERHEADER.Location = LOCATION;
}


function InitVues() {
    InitVueModalComponents();
    InitVueFilters();

    var customerHeaderVueOptions = {
        el: '#customerHeader',
        methods: {
            GetTotalARBalanceOfLocations: function () {
                var tmpTotal = 0;

                this.OtherLocations.LocationResults.forEach(function (el) {
                    tmpTotal += parseFloat(el.ARBalance);
                });
                tmpTotal += parseFloat(this.ARBalance);
                return tmpTotal;
            },
            ConvertPhoneType: function (type) {
                switch (type) {
                    case ('H'):
                        return 'Home';
                    case ('M'):
                        return 'Mobile';
                    case ('W'):
                        return 'Work';
                    default:
                        return 'Home';
                }
            },
            OpenEditContactInfoModal: function () {
                this.showUpdateContactInfoModal = true;
                this.MailingAddress.IsSendingMailingAddress = false;
                this.MailingAddress.AjaxSuccess = false;
                this.MailingAddress.AjaxResponse = '';
                InitStreetTypeTypeahead();
            }
            ,
            AddressType_onChange: function () {
                this.MailingAddress.AptNbr = '';

                if (this.MailingAddress.AddressType === 'pobox') {
                    this.MailingAddress.AptDesc = 'PO BOX';
                    this.MailingAddress.StreetNbr = '';
                    this.MailingAddress.StreetDirectionP = '';
                    this.MailingAddress.StreetName = '';
                    this.MailingAddress.StreetType = '';
                    this.MailingAddress.StreetDirection = '';
                }
                else {
                    this.MailingAddress.AptDesc = '';
                }
            },
            contactInfo_submit_onclick: function () {

                this.MailingAddress.IsSendingMailingAddress = true;
                this.MailingAddress.AjaxResponse = '';
                UpdateContactInfo(this.MailingAddress, this.PhoneNumbers, this.Email)
                    .done(function (result) {
                        vCUSTOMERHEADER.MailingAddress.AjaxResponse = result.d.Message;
                        vCUSTOMERHEADER.MailingAddress.AjaxSuccess = result.d.Success;
                    })
                    .fail(function (result) {
                        vCUSTOMERHEADER.MailingAddress.AjaxResponse = "Server Error";
                        vCUSTOMERHEADER.MailingAddress.AjaxSuccess = false;
                    })
                    .always(function () {
                        vCUSTOMERHEADER.MailingAddress.IsSendingMailingAddress = false;
                        GetMailingAddressData();
                        GetCustomerHeaderData();
                    });
            },
            contactInfo_reset_onclick: function () {
                var keys = Object.keys(this.OriginalMailingAddress);
                for (var i = 0; i < keys.length; i++) {
                    var property = keys[i];
                    if (this.MailingAddress.hasOwnProperty(property))
                        this.MailingAddress[property] = this.OriginalMailingAddress[property];
                }

                keys = Object.keys(this.OriginalPhoneNumbers);
                for (i = 0; i < keys.length; i++) {
                    property = keys[i];
                    if (this.PhoneNumbers.hasOwnProperty(property))
                        this.PhoneNumbers[property] = this.OriginalPhoneNumbers[property];
                }
            },
            contactInfo_cancel_onclick: function () {
                this.contactInfo_reset_onclick();
                this.showUpdateContactInfoModal = false;
            }
        },
        data: {
            Customer: '',
            Location: '',
            CustomerName: '',
            ARBalance: '',
            showUpdateContactInfoModal: false,
            showContactInfoDisplayModal: false,
            showOtherLocationsModal: false,
            PhoneNumbers: {
                Phone1: '',
                Phone2: '',
                Phone3: '',
                Phone1Type: '',
                Phone2Type: '',
                Phone3Type: '',
                Phone1Display: '',
                Phone2Display: '',
                Phone3Display: ''
            },
            OriginalPhoneNumbers: {
                Phone1: '',
                Phone2: '',
                Phone3: '',
                Phone1Type: '',
                Phone2Type: '',
                Phone3Type: ''
            },
            ServiceAddress: {
                ServiceAddressLine1: '',
                ServiceAddressCityStateZip: '',
                Zone: '',
                StreetName: '',
                StreetNbr: ''
            },
            MailingAddress: {
                IsSendingMailingAddress: false,
                AjaxSuccess: false,
                AjaxResponse: '',
                AddressType: 'street',
                StreetNbr: '',
                StreetName: '',
                StreetType: '',
                StreetDirectionP: '',
                StreetDirection: '',
                AptDesc: '',
                AptNbr: '',
                City: '',
                State: '',
                ZipCode: '',
                Country: '',
                MailingAddressLine1: '',
                MailingAddressCityStateZip: ''
            },
            OriginalMailingAddress: {
                AddressType: 'street',
                StreetNbr: '',
                StreetName: '',
                StreetType: '',
                StreetDirectionP: '',
                AptDescr: '',
                AptNbr: '',
                City: '',
                State: '',
                ZipCode: '',
                Country: ''
            },
            Class: '',
            Cycle: '',
            Email: '',
            OtherLocations: {
                LocationResults: [
                    {
                        Location: '',
                        Customer: '',
                        ServiceAddressLine1: '',
                        ARBalance: '',
                        CurrentElectric: '',
                        CurrentWater: '',
                        CurrentGas: '',
                        CurrentCable: '',
                        CurrentInternet: '',
                        redirectURL: ''
                    }],

                Total: '',
                InitialLoad: true,
                Retrieving: false
            },
            ActiveServices: {
                Electric: '0',
                Gas: '0',
                Water: '0',
                Cable: '0',
                Internet: '0'
            }
        }
    };

    vCUSTOMERHEADER = new Vue(customerHeaderVueOptions);

    var vueOptions = {
        el: '#BillingSummary',
        methods: {
            OpenAccountStatement: function () {
                var url = 'http://eusvr70/ReportServer/Pages/ReportViewer.aspx?/Dept_CSR/Statement+Generator&rs:Command=Render&LocationID=' + LOCATION + '&CustNbr='
                    + CUSTOMER;
                var win = window.open(url, '_blank');
                win.focus();
            },
            ExpandCategory: function (category, expand) {
                category.expand = expand;
            },
            Service_onclick: function (service) {
                this.showChartModal = true;
                var chartType = service.toLowerCase();
                this.chartType = chartType;

                //GetConsumptionData(chartType); TODO: Copy over GetConsumptionData() from CustomerPageDriver.js and integrate into new structure
            },
            OpenEditEmailList: function () {
                window.open('http://eusvr41/Appendix/EmailView/Customer/' + CUSTOMER, '', popupSettings);
            }
        },
        computed: {
            totalMostRecentMonthCharges: function () {
                var total = this.Records.reduce(function (sum, value) {
                    return sum + parseFloat(value.MostRecentMonthCharges);
                }, 0);
                return isNaN(total) ? "N/A" : total;
            },
            totalPriorMonthCharges: function () {
                var total = this.Records.reduce(function (sum, value) {
                    return sum + parseFloat(value.PriorMonthCharges);
                }, 0);
                return isNaN(total) ? "N/A" : total;
            },
            totalCurrMonthPriorYearCharges: function () {
                var total = this.Records.reduce(function (sum, value) {
                    return sum + parseFloat(value.CurrMonthPriorYearCharges);
                }, 0);
                return isNaN(total) ? "N/A" : total;
            },
            totalYTDCharges: function () {
                return this.Records.reduce(function (sum, value) {
                    return sum + parseFloat(value.YTDCharges);
                }, 0);
            },
            totalFiscalYTDCharges: function () {
                return this.Records.reduce(function (sum, value) {
                    return sum + parseFloat(value.FiscalYTDCharges);
                }, 0);
            },
            mostRecentMonth: function () {
                var mostRecent = FindMostRecentRecord(this.Records);
                return moment(mostRecent).format('MMMM YYYY');
            },
            mostRecentPriorMonth: function () {
                var mostRecent = FindMostRecentRecord(this.Records);
                mostRecent.subtract(1, 'months');
                return moment(mostRecent).format('MMMM YYYY');
            },
            mostRecentMonthPriorYear: function () {
                var mostRecent = FindMostRecentRecord(this.Records);
                mostRecent.subtract(1, 'years');
                return moment(mostRecent).format('MMMM YYYY');
            }
        },
        data: {
            showBillingSummaryDetails: false,
            Records:
                [{
                    Service: '',
                    AvgDailyConsumption: '',
                    MostRecentMonthCharges: '',
                    PriorMonthCharges: '',
                    CurrMonthPriorYearCharges: '',
                    YTDCharges: '',
                    FiscalYTDCharges: '',
                    MostRecentBillingDate: ''
                }],
            showChartModal: false,
            chartTypes: {
                electric: false,
                gas: false,
                water: false
            },
            showElectricDetails: false,
            ElectricDetailRecords: [],
            Electric: {
                Connections: [],
                MiscCharges: []
            },
            Water: {
                Connections: [],
                MiscCharges: []
            },
            Gas: {
                Connections: [],
                MiscCharges: []
            },
            Internet: {
                Connections: [],
                MiscCharges: [],
                Equipment: [],
                EmailAddresses: []
            },
            Cable: {
                Connections: [],
                MiscCharges: [],
                Equipment: [],
                CableBridgeCommands: []
            },
            showGasDetails: false,
            GasDetailRecords: [],
            showWaterDetails: false,
            WaterDetailRecords: [],
            showCableDetails: false,
            CableDetailCategories: [{
                Document: '',
                BillDate: '',
                items: [{

                    Rates: '',
                    Description: '',
                    Quantity: '',
                    UnitPrice: '',
                    TotalPrice: '',
                    ServiceType: ''
                }],
                totalPrice: '',
                Quantity: '',
                Rates: '',
                ServiceTypes: ''


            }],
            showInternetDetails: false,
            InternetDetailCategories: [{
                ServiceOrderNumber: '',
                Status: '',
                Dept: '',
                Requested: '',
                Completed: '',
                Description: '',
                items: [{

                    Tasks: '',
                    Charge: '',
                    Complete: ''
                }],
                totalPrice: '',
                Complete: '',
                Tasks: '',
                Comments: ''
            }],
            ActiveServices: {
                Electric: '0',
                Gas: '0',
                Water: '0',
                Cable: '0',
                Internet: '0'
            }
        }
    };

    vBILLINGSUMMARY = new Vue(vueOptions);

    vueOptions = {
        el: '#AccountBalance',
        methods: {

            OpenCustomerCashiering: function () {
                var url = 'http://eusvr41/customercashiering/billing/paymentstart.aspx?LocationID=' + LOCATION + '&CustNbr='
                    + CUSTOMER;
                var win = window.open(url, '_blank');
                win.focus();
            },
            OpenAccountStatement: function () {
                var url = 'http://eusvr70/ReportServer/Pages/ReportViewer.aspx?/Dept_CSR/Statement+Generator&rs:Command=Render&LocationID=' + LOCATION + '&CustNbr='
                    + CUSTOMER;
                var win = window.open(url, '_blank');
                win.focus();
            },
            SendCableReset: function () {
                //__doPostBack('btnSendAccountReset', $('#hf_Username').val() + "," + this.Location);
                this.CableReset.ShowModal = true;
                SendCableResetCommand(USERNAME + "," + LOCATION);
            }
        },
        data: {
            ARBalance: '',
            LastPaymentAmt: '',
            LastPaymentDate: '',
            showARModal: false,
            Pastdue: '',
            alarmstatus: '',
            Current: '',
            ThirtyDays: '',
            SixtyDays: '',
            NinetyDays: '',
            OverNinetyDays: '',
            unapplied: '',
            Total: '',
            over30dayspastdue: '',
            duedate: ''
            , BudgetAmt: ''
            , BudgetEndDate: ''
            , CustomerPortal: {
                Email: '',
                IsApproved: '',
                Username: '',
                ResetPwdURL: '',
                eBilling: '',
                EnrolledInAutoPay: false
            }
            , showCustomerPortalDetails: false
            , showRecentPayments: false
            , RecentPayments: {
                Records: []
            },
            ActiveServices: {
                Electric: '0',
                Gas: '0',
                Water: '0',
                Cable: '0',
                Internet: '0'
            }
            , CableReset: {
                ShowModal: false,
                IsSending: false,
                Response: '',
                ResponseLabelColor: 'black'
            }
            , AssistanceProgram: {
                USPPCustomer: ''
            },
            AggressiveBehavior: false
        }
    };
    vACCOUNTBALANCE = new Vue(vueOptions);


    var customerCommsVueOptions = {
        el: '#CustomerComms',
        methods: {
            GetDayOfWeek: function (date) {
                switch (moment(date).day()) {
                    case (0):
                        return 'SU';
                    case (1):
                        return 'M';
                    case (2):
                        return 'TU';
                    case (3):
                        return 'W';
                    case (4):
                        return 'TH';
                    case (5):
                        return 'F';
                    case (6):
                        return 'SA';
                }
            },
            GetIcon: function (type) {
                var baseUrl = "Images/CustomerCommunications/";
                switch (type) {
                    case ('ITC'):
                        return baseUrl + "VTT.svg";
                    case ('CC'):
                        return baseUrl + "CRM.svg";
                    case ('OMS'):
                        return baseUrl + "OMS.svg";
                    case ('MBL'):
                        return baseUrl + "SOrder.svg";
                    default:
                        return '';
                }
            },
            GetLink: function (URL) {
                //return "javascript:void(window.open('" + URL + "', '', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=800,height=450,left=40,top=50'))";
                return GetPopUpURL(URL);

            },
            GetNewLink: function (type) {
                var URL = '';
                switch (type) {
                    case ('CRM'):
                        URL = "http://eusvr41/crmform/default.aspx?CustNbr=" + CUSTOMER + "&LocationID=" + LOCATION + "&Author=" + USERNAME;
                        break;
                    case ('OMS'):
                        URL = "http://eusvr41/CustomerSummaryForms/OutageDetailForm.aspx?Location=" + LOCATION + "&Customer=" + CUSTOMER + "&Refresh=CustomerSummary";
                        break;
                    case ('VTT'):
                        URL = "http://eusvr41/internettechsupport/searchcustomer.aspx?Action=NewTicket&Location=" + LOCATION + "&Customer=" + CUSTOMER;
                        break;
                    case ('VIEWALL'):
                        URL = "http://eusvr41/ReportServer/Pages/ReportViewer.aspx?/CustomerSummary/srCustomerCommunication&rs:Command=Render&Location=" + LOCATION + "&Customer=" + CUSTOMER
                            + "&UserID=" + USERNAME;
                        break;
                }
                if (type === "VIEWALL")
                    return "javascript:void(window.open('" + URL + "'))";
                else
                    return GetPopUpURL(URL);
            }
        },
        data: {
            Rows: [],
            IsLoading: true,
            IsInternetTech : 0
        }
    };

    vCUSTOMERCOMMS = new Vue(customerCommsVueOptions);

    vueOptions = {
        el: '#CustomerAnalysis',
        methods: {
        },
        data: {
            CustomerAnalysisRecords: [],
            IsLoading: true
        }
    };

    vCUSTOMERANALYSIS = new Vue(vueOptions);


    /* Consumption Charts */
    var consumptionChartsVueOptions = {
        el: '#ConsumptionChartContainer',
        methods: {
        },
        data: {
            HBO: '',
            Starz: '',
            Showtime: '',
            Cinemax: '',
            TheMovieChannel: '',
            CablePackage: '',
            InternetPackage: ''
        }
    };
    vCONSUMPTIONCHARTS = new Vue(consumptionChartsVueOptions);
}

function InitVueModalComponents() {
    // register modal component
    Vue.component('modal', {
        template: '#modal-template'
    });
    Vue.component('chartmodal', {
        template: '#chartmodal-template'
    });
    Vue.component('smallmodal', {
        template: '#smallmodal-template'
    });
}

/* Vue Filters for formatting values */
function InitVueFilters() {
    
    Vue.filter('formatCurrency', function (value) {
        if (value) {
            if (isNaN(value))
                return value;
            return '$' + parseFloat(value.toString()).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    });

    Vue.filter('formatDecimal', function (value) {
        if (value) {
            return parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    });

    Vue.filter('formatDateOnly', function (value) {
        if (value) {
            return moment(value).format('MM/DD/YYYY');
        }
    });
    Vue.filter('formatDateTime', function (value) {
        if (value) {
            return moment(value).format('MM/DD/YY hh:mm A');
        }
    });
    Vue.filter('formatTitleCase', function (value) {
        return value.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    });
}


/* Queryserve Data Fetch functions */

// Top level data fetch to retrieve all report data for widgets
function GetWidgetData() {
    GetCustomerHeaderData();
    GetAccountBalanceData();
    GetBillingSummaryData();
    GetCustomerCommunicationsData();
    GetActiveServicesAndChartData();
    GetCustomerAnalysisData();
    GetDetailData();
}

function GetDetailData() {
    GetCustomerHeaderDetail();
    GetAccountBalanceDetail();
    GetBillingSummaryDetail();
}


function GetCustomerHeaderData() {
    var queryParams = {
        parameters: [
            ['LocationID', LOCATION],
            ['CustNbr', CUSTOMER]
        ]
    };

    /* Customer Master data */
    queryObjParams = {
        dataCallID: "756C58F8-FAFA-4CFE-8AA8-684078B4C289",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(dsCustomerMaster_onSuccess);
}

function GetCustomerHeaderDetail() {
    var queryParams = {
        parameters: [
            ['LocationID', LOCATION],
            ['CustNbr', CUSTOMER]
        ]
    };
    /* Location Service Address data */
    queryObjParams = {
        dataCallID: "BFD392F1-CA81-4B87-AE82-4F8FF1826494",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(dsLocationServiceAddress_onSuccess);


    /* Other Locations data */
    vCUSTOMERHEADER.OtherLocations.LocationResults = [];
    vCUSTOMERHEADER.OtherLocations.Retrieving = true;
    $('#tbl_LocationResults tfoot').show();
    queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };
    queryObjParams = {
        dataCallID: "a6b4a174-350e-4f75-ac04-c3ac3398aec5",
        parameters: queryParams
    };

    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(LocationSearch_onSuccess);

    /* Mailing Address data */
    GetMailingAddressData();
}

function GetAccountBalanceData() {
    var queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };

    /* Account Balance */
    var AccountBalanceQueryObjParams = {
        dataCallID: "8891A101-5B8C-4D5A-A719-71B693511989",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(AccountBalanceQueryObjParams).done(AccountBalance_onSuccess);

    /* Past Due */
    var ARAnalysisQueryObjParams = {
        dataCallID: "38A19951-241B-45A5-A1E1-2ACE1442C352",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(ARAnalysisQueryObjParams).done(DSARAnalysis_onSuccess);

    /* Last Payment */
    var LastPaymentQueryObjParams = {
        dataCallID: "6652993F-CD72-4D99-9773-FD6B4D64229C",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(LastPaymentQueryObjParams).done(LastPayment_onSuccess);

    /* USPP Customer */
    var USPPqueryParams = {
        parameters: [['Customer', CUSTOMER]]
    };


    var USPPCustomerQueryObjParams = {
        dataCallID: "f493de09-7962-47ab-8b0e-d234604780b3",
        parameters: USPPqueryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(USPPCustomerQueryObjParams).done(USPPCustomer_onSuccess);

    /* Budget */

    /* Customer Flags (Aggressive Behavior) */
    var CustomerFlagsQueryObjParams = {
        dataCallID: "C60D1FC5-7052-4B32-87AD-18CA18EC30FF",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(CustomerFlagsQueryObjParams).done(CustomerFlags_onSuccess);
    
}

function GetAccountBalanceDetail() {
    var queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };

    /* Customer Portal */
    var dataCallParams = {
        dataCallID: "6EAB94BF-4F60-420B-BC1A-B5F4EE652E28",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(dataCallParams).done(GetCustomerPortalDetails_onSuccess);

    /* Recent Payments */

    var Last5PaymentsQueryObjParams = {
        dataCallID: "8c140259-b6f6-4aad-99e7-cb49018e9a58",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(Last5PaymentsQueryObjParams).done(Last5Payments_onSuccess);
}
function GetBillingSummaryData() {
    var queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };
    
    var billingSummaryQueryObjParams = {
        dataCallID: "7178736F-3F13-46AA-B364-295DA6BC282B",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(billingSummaryQueryObjParams).done(DSBillingSummary_onSuccess);
    
}

function GetBillingSummaryDetail() {
    var queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };
    // ElectricDetail for modal
    var ElectricDetailObjParams = {
        dataCallID: "484edc18-0762-4ef9-a6b2-86b52591a6ed",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(ElectricDetailObjParams).done(ElectricDetail_onSuccess);

    // GasDetail for modal
    var GasDetailObjParams = {
        dataCallID: "62875382-f5d9-4c01-9071-4aeb380f4bba",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(GasDetailObjParams).done(GasDetail_onSuccess);

    // WaterDetail for modal
    var WaterDetailObjParams = {
        dataCallID: "836b5616-849e-4a06-95fc-cbac5d260a17",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(WaterDetailObjParams).done(WaterDetail_onSuccess);

    // InternetDetail for modal
    var InternetDetailObjParams = {
        dataCallID: "6337f750-fcf0-4f78-8f81-3b527a82f750",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(InternetDetailObjParams).done(InternetDetail_onSuccess);

    // CableDetail for modal
    var CableDetailObjParams = {
        dataCallID: "bbacae15-d624-4aab-b781-3c5f35cfc030",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(CableDetailObjParams).done(CableDetail_onSuccess);

    /* Electric Connections */
    queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER],
            ['service', 'electric']
        ]
    };

    /* Electric connections/misc charges */
    var serviceType = 'electric';
    GetServiceConnections(serviceType, ElectricConnections_onSuccess);
    GetMiscCharges(serviceType, ElectricMiscCharges_onSuccess);

    /* Water connections/misc charges */
    serviceType = 'water';
    GetServiceConnections(serviceType, WaterConnections_onSuccess);
    GetMiscCharges(serviceType, WaterMiscCharges_onSuccess);
    /* Gas connections/misc charges */
    serviceType = 'gas';
    GetServiceConnections(serviceType, GasConnections_onSuccess);
    GetMiscCharges(serviceType, GasMiscCharges_onSuccess);
    /* Water connections/misc charges */
    serviceType = 'internet';
    GetServiceConnections(serviceType, InternetConnections_onSuccess);
    GetMiscCharges(serviceType, InternetMiscCharges_onSuccess);
    /* Water connections/misc charges */
    serviceType = 'cable';
    GetServiceConnections(serviceType, CableConnections_onSuccess);
    GetMiscCharges(serviceType, CableMiscCharges_onSuccess);

    /* Internet/cable equipment */

    queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };

    var EquipmentDetailQueryObjParams = {
        dataCallID: "be3ad35f-ce3e-4c6d-9e13-b90b2609de0f",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(EquipmentDetailQueryObjParams).done(EquipmentDetail_onSuccess);

    /* CableBridge commands */

    GetCableBridgeDetail();

    /* Internet Email Addresses */
    queryParams = {
        parameters: [
            ['custNbr', CUSTOMER]
        ]
    };
    var EmailAddressesObjParams = {
        dataCallID: "9f6b4b92-0d5a-4c0d-ab71-bddeacb9af79",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(EmailAddressesObjParams).done(EmailAddresses_onSuccess);
}

function GetCableBridgeDetail() {
    var queryParams = {
        parameters: [
            ['Location', LOCATION]
        ]
    };

    var CommandBridgeQueryObjParams = {
        dataCallID: "cdb25cd7-baf2-491e-b1fa-478e72365fc2",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(CommandBridgeQueryObjParams).done(CommandBridge_onSuccess);
}
function GetServiceConnections(serviceType, OnSuccessHandler) {
    var tmpQueryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER],
            ['service', serviceType]
        ]
    };
    var connectionsObjParams = {
        dataCallID: "8E64D804-D16B-4D97-A2FB-88F45BB7F251",
        parameters: tmpQueryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(connectionsObjParams).done(OnSuccessHandler);
}
function GetMiscCharges(serviceType, OnSuccessHandler) {
    var tmpQueryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER],
            ['ServiceType', serviceType]
        ]
    };
    var queryObjParams = {
        dataCallID: "1E012C2D-A305-4D7A-98F8-905E037F70DF",
        parameters: tmpQueryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(OnSuccessHandler);
}

function GetCustomerAnalysisData() {

    var queryParams = {
        parameters: [
            ['Location', LOCATION],
            ['Customer', CUSTOMER]
        ]
    };


    // Customer Analysis data
    var CustomerAnalysisObjParams = {
        dataCallID: "f9dc1549-1a0e-4452-aad4-dd8f3a9e4c00",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(CustomerAnalysisObjParams).done(CustomerAnalysis_onSuccess);

}

function GetCustomerCommunicationsData() {
    var queryParams = {
        parameters: [
            ['Location', LOCATION]
            , ['CustNbr', CUSTOMER]
            , ['UserID', USERNAME]
        ]
    };
    /* Customer communications */
    var queryObjParams = {
        dataCallID: "2DC4E07E-C3FA-459C-BB09-80196820194C",
        parameters: queryParams
    };

    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(GetCustomerCommunications_onSuccess);

    /* Is internet tech? */
    queryParams = {
        parameters: [
            ['Username', USERNAME]
        ]
    };
    queryObjParams = {
        dataCallID: "B68B1150-932D-4D5C-A8C6-05DEB523E79B",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(IsInternetTech_onSuccess);
}

function GetActiveServicesAndChartData(){
    var queryParams = {
        parameters: [
            ['customer', CUSTOMER],
            ['location', LOCATION]
        ]
    };
    var ActiveService_objParams = {
        dataCallID: 'a4cffd93-e364-4c4a-9bc2-004f045b44db',
        parameters: queryParams
    };
    /* Active services, chart data dependent on ActiveService_OnSuccess */
    QueryServeDataUtility.getQueryObject_DataCall(ActiveService_objParams).done(ActiveService_OnSuccess);

    /* Cable/internet 'chart' */
    var CableAndInternet_objParams = {
        dataCallID: 'f5b452d6-63f3-4485-8f87-4d612a30aabb',
        parameters: queryParams
    };

    QueryServeDataUtility.getQueryObject_DataCall(CableAndInternet_objParams).done(GetCableAndInternetData_OnSuccess);
}


function GetConsumptionData(chartType) {

    //// Billed Consumption Chart
    /*  $('#electricChart').hide();
      $('#gasChart').hide();
      $('#waterChart').hide(); */
    if (chartType === 'electric') {
        $('#electricChart').show();
        /* Electric Chart */
        var BilledConsumption_queryParams = {
            parameters: [
                ['Location', LOCATION],
                ['Customer', CUSTOMER],
                ['ServiceCategoryID', '1']
            ]
        };

        var BilledConsumptionChartElectric_objParams = {
            dataCallID: 'C67B6889-699B-4C2F-8A4D-C43DEFA0291F',
            parameters: BilledConsumption_queryParams
        };
        //QueryServe.createChart(BilledConsumptionChartElectric_objParams);
        QueryServeDataUtility.getQueryObject_DataCall(BilledConsumptionChartElectric_objParams).done(GetElectricChartData_OnSuccess);
    }
    else if (chartType === 'gas') {
        $('#gasChart').show();
        /* Gas Chart */
        BilledConsumption_queryParams = {
            parameters: [
                ['Location', LOCATION],
                ['Customer', CUSTOMER],
                ['ServiceCategoryID', '4']
            ]
        };
        var BilledConsumptionChartGas_objParams = {
            dataCallID: 'C67B6889-699B-4C2F-8A4D-C43DEFA0291F',
            parameters: BilledConsumption_queryParams
        };
        QueryServeDataUtility.getQueryObject_DataCall(BilledConsumptionChartGas_objParams).done(GetGasChartData_OnSuccess);
    }
    else if (chartType === 'water') {

        $('#waterChart').show();
        /* Water Chart */
        BilledConsumption_queryParams = {
            parameters: [
                ['Location', LOCATION],
                ['Customer', CUSTOMER],
                ['ServiceCategoryID', '2']
            ]
        };

        var BilledConsumptionChartWater_objParams = {
            dataCallID: 'C67B6889-699B-4C2F-8A4D-C43DEFA0291F',
            parameters: BilledConsumption_queryParams
        };
        //QueryServe.createChart(BilledConsumptionChartWater_objParams);
        QueryServeDataUtility.getQueryObject_DataCall(BilledConsumptionChartWater_objParams).done(GetWaterChartData_OnSuccess);
    }
}

function GetMailingAddressData() {

    var queryParams = {
        parameters: [
            ['LocationID', LOCATION],
            ['CustNbr', CUSTOMER]
        ]
    };
    var queryObjParams = {
        dataCallID: "AD74EC35-4A0D-4874-9E5D-8379DC021CC0",
        parameters: queryParams
    };
    QueryServeDataUtility.getQueryObject_DataCall(queryObjParams).done(dsCustomerMailingAddress_onSuccess);
}


/* Databinding OnSuccess/done functions */


function dsCustomerMaster_onSuccess(data) {
    if (!HasData(data, "dsCustomerMaster_onSuccess"))
        return;
    
   vCUSTOMERHEADER.PhoneNumbers.Phone1 = data[0].Phone1;
   vCUSTOMERHEADER.PhoneNumbers.Phone2 = data[0].Phone2;
   vCUSTOMERHEADER.PhoneNumbers.Phone3 = data[0].Phone3;
   vCUSTOMERHEADER.PhoneNumbers.Phone1Type = data[0].Phone1Type;
   vCUSTOMERHEADER.PhoneNumbers.Phone2Type = data[0].Phone2Type;
   vCUSTOMERHEADER.PhoneNumbers.Phone3Type = data[0].Phone3Type;
   vCUSTOMERHEADER.PhoneNumbers.Phone1Display = data[0].Phone1Display;
   vCUSTOMERHEADER.PhoneNumbers.Phone2Display = data[0].Phone2Display;
   vCUSTOMERHEADER.PhoneNumbers.Phone3Display = data[0].Phone3Display;

    vCUSTOMERHEADER.OriginalPhoneNumbers.Phone1 = data[0].Phone1;
    vCUSTOMERHEADER.OriginalPhoneNumbers.Phone2 = data[0].Phone2;
    vCUSTOMERHEADER.OriginalPhoneNumbers.Phone3 = data[0].Phone3;
    vCUSTOMERHEADER.OriginalPhoneNumbers.Phone1Type = data[0].Phone1Type;
    vCUSTOMERHEADER.OriginalPhoneNumbers.Phone2Type = data[0].Phone2Type;
    vCUSTOMERHEADER.OriginalPhoneNumbers.Phone3Type = data[0].Phone3Type;

    vCUSTOMERHEADER.CustomerName = data[0].CustomerName;
    vCUSTOMERHEADER.Class = data[0].Class;
    vCUSTOMERHEADER.Cycle = data[0].Cycle;
    vCUSTOMERHEADER.Email = data[0].Email;
}

function LocationSearch_onSuccess(data) {
    Passparameter = new String;
    // Adds on the search variables from the text boxes to URL to pass. 
    Passparameter = Passparameter + '&Name=' + getParameterByName('Name');
    Passparameter = Passparameter + '&ServiceAddress=' + getParameterByName('ServiceAddress');
    Passparameter = Passparameter + '&Phone=' + getParameterByName('Phone');
    Passparameter = Passparameter + '&Equipment=' + getParameterByName('Equipment');
    Passparameter = Passparameter + '&SSN=' + getParameterByName('SSN');
    Passparameter = Passparameter + '&isInActive=' + getParameterByName('isInActive');
    Passparameter = Passparameter + '&StatementNumber=' + getParameterByName('StatementNumber');
    Passparameter = Passparameter + '&SortBy=' + getParameterByName('SortBy') + '&Direction=' + getParameterByName('Direction');

    // Individual Customer and Location for the url's of individual results


    var total = 0;
    for (var i = 0; i < data.length; i++) {
        //if enter here - more than one account as current location is excluded from results
        var currResult = data[i];
        //Adds ARBalance of each other account to running Total
        total = parseFloat(data[i].ARBalance);
        //Triggers switch to allow method to operate to see div_OtherLocations
        MultipleAccounts = true;
        //Changes color of LocationIndicator from gray to indicate other accounts
        $('#LocationIndicator').css({ "color": "white" });
        var customerID = CUSTOMER;
        var locationID = currResult.Location;
        var redirectURL = 'CustomerPage.aspx?Customer=' + customerID.trim() + '&Location=' + locationID.trim() + Passparameter;
        //Includes redirect for switching between locations
        data[i].redirectURL = redirectURL;
    }

    //Passes data to Vue for HTML to access
    vCUSTOMERHEADER.OtherLocations.LocationResults = data;
    vCUSTOMERHEADER.OtherLocations.Total = total;
    $('#tbl_LocationResults tfoot').show();
}
function dsLocationServiceAddress_onSuccess(data) {
    if (!HasData(data, "dsLocationServiceAddress_onSuccess"))
        return;

    for (var property in data[0]) {
        if (vCUSTOMERHEADER.ServiceAddress.hasOwnProperty(property))
            vCUSTOMERHEADER.ServiceAddress[property] = data[0][property];
    }
}


function AccountBalance_onSuccess(data) {
    if (data[0].ARBalance) {
        vCUSTOMERHEADER.ARBalance = data[0].ARBalance;
        for (var property in data[0]) {
            if (vACCOUNTBALANCE.hasOwnProperty(property))
                vACCOUNTBALANCE[property] = data[0][property];
        }
        var balance = vCUSTOMERHEADER.ARBalance;
        if (parseFloat(balance).toFixed(2).length >= NumberThresholds[0]) {
            if (parseFloat(balance).toFixed(2).length >= NumberThresholds[1]) {
                ApplyAccountBalanceStyle(FontSizeClasses[1]);
                return;
            }
            ApplyAccountBalanceStyle(FontSizeClasses[0]);
        }
    }
}
function DSBillingSummary_onSuccess(data) {
    if (!HasData(data, "DSBillingSummary_onSuccess"))
        return;

    for (var i = 0; i < data.length; i++)
        data[0].AvgDailyConsumption = '';
    vBILLINGSUMMARY.Records = data;

    var currentMonth = vBILLINGSUMMARY.totalMostRecentMonthCharges;
    var priorMonth = vBILLINGSUMMARY.totalPriorMonthCharges;
    var cmpy = vBILLINGSUMMARY.totalCurrMonthPriorYearCharges;
    var greenArrow = "fa fa-arrow-circle-down fa-2x fontResizable normal greentext";
    var redArrow = "fa fa-arrow-circle-up fa-2x fontResizable normal redtext";

    if (currentMonth !== 'N/A') {
        if (priorMonth !== 'N/A') {
            if (currentMonth - priorMonth > 0) {
                $("#PriorMonthArrow").removeClass(greenArrow);
                $("#PriorMonthArrow").addClass(redArrow);
            } else if (currentMonth - priorMonth < 0) {
                $("#PriorMonthArrow").removeClass(redArrow);
                $("#PriorMonthArrow").addClass(greenArrow);
            }
        }
        if (cmpy !== 'N/A') {
            if (currentMonth - cmpy > 0) {
                $("#CMPYArrow").removeClass(greenArrow);
                $("#CMPYArrow").addClass(redArrow);
            } else if (currentMonth - cmpy < 0) {
                $("#CMPYArrow").removeClass(redArrow);
                $("#CMPYArrow").addClass(greenArrow);
            }
        }
    }

    if (currentMonth.toFixed(2).length >= NumberThresholds[0] || priorMonth.toFixed(2).length >= NumberThresholds[0] || cmpy.toFixed(2).length >= NumberThresholds[0]) {
        if (currentMonth.toFixed(2).length >= NumberThresholds[1] || priorMonth.toFixed(2).length >= NumberThresholds[1] || cmpy.toFixed(2).length >= NumberThresholds[1]) {
            ApplyBillingSummaryStyle(FontSizeClasses[1]);
            return;
        }
        ApplyBillingSummaryStyle(FontSizeClasses[0]);
    }
}

function DSARAnalysis_onSuccess(data) {
    if (HasData(data, "DSARAnalysis_onSuccess")) {
        for (var property in data[0]) {
            if (vACCOUNTBALANCE.hasOwnProperty(property))
                vACCOUNTBALANCE[property] = data[0][property];
        }
    }
}

function LastPayment_onSuccess(data) {
    if (!HasData(data, "LastPayment_onSuccess"))
        return;
    vACCOUNTBALANCE.LastPaymentAmt = data[0].Amount;
    vACCOUNTBALANCE.LastPaymentDate = data[0].Date;
}

function USPPCustomer_onSuccess(data) {
    if (!HasData(data, "USPPCustomer_onSuccess"))
        return;
    vACCOUNTBALANCE.AssistanceProgram.USPPCustomer = data[0].AssistancePgm;
}

function CustomerFlags_onSuccess(data) {
    if (!HasData(data, "CustomerFlags_onSuccess"))
        return;
    vACCOUNTBALANCE.AggressiveBehavior = data[0].AggressiveBehavior === 'True';
}

function ElectricDetail_onSuccess(data) {
    vBILLINGSUMMARY.ElectricDetailRecords = data;
}

function GasDetail_onSuccess(data) {
    vBILLINGSUMMARY.GasDetailRecords = data;
}

function WaterDetail_onSuccess(data) {
    vBILLINGSUMMARY.WaterDetailRecords = data;
}

function CableDetail_onSuccess(data) {
    var categories = [];
    var Rates = null;
    var Service = null;

    for (var i = 0; i < data.length; i++) {

        /* Find category in categories if exists */
        var currItem = data[i];
        var Format = parseFloat(data[i].TotalPrice);
        currItem.TotalPrice = Format.toFixed(2);
        var category = null;


        for (var j = 0; j < categories.length; j++) {
            var currCategory = categories[j];
            if (currCategory.Document === currItem.Document) {
                category = currCategory;
            }


        }
        /* Create new category object and put it in array, if it doesn't exist yet in categories */
        if (category === null) {

            category = {
                Document: currItem.Document,
                BillDate: currItem.BillDate,
                ServiceTypes: 0,
                Rates: 0,
                items: [],
                expand: false,
                totalPrice: 0,
                Quantity: 0
            };
            categories.push(category);
            Rates = null;
            Service = null;

        }


        /* Add price total to category total */
        category.totalPrice = parseFloat(category.totalPrice) + parseFloat(currItem.TotalPrice);
        category.totalPrice = category.totalPrice.toFixed(2);
        category.Quantity = parseFloat(category.Quantity) + parseFloat(currItem.Quantity);
        if (Rates !== currItem.Rates) {
            category.Rates = parseFloat(category.Rates) + parseFloat(1);
        }

        if (Service !== currItem.ServiceType) {
            category.ServiceTypes = parseFloat(category.ServiceTypes) + parseFloat(1);
        }


        /* Add item to category's items array */
        category.items.push(currItem);

        Rates = currItem.Rates;
        Service = currItem.ServiceType;

    }

    /* Update Vue data with new grouped dataset */
    $('#CableDetail tfoot').hide();
    vBILLINGSUMMARY.CableDetailCategories = categories;
}

function InternetDetail_onSuccess(data) {

    var categories = [];
    var Rates = null;
    var Service = null;

    for (var i = 0; i < data.length; i++) {

        /* Find category in categories if exists */
        var currItem = data[i];
        var Format = parseFloat(data[i].TotalPrice);
        currItem.TotalPrice = Format.toFixed(2);
        var category = null;


        for (var j = 0; j < categories.length; j++) {
            var currCategory = categories[j];
            if (currCategory.Document === currItem.Document) {
                category = currCategory;
            }


        }
        /* Create new category object and put it in array, if it doesn't exist yet in categories */
        if (category === null) {

            category = {
                Document: currItem.Document,
                BillDate: currItem.BillDate,
                ServiceTypes: 0,
                Rates: 0,
                items: [],
                expand: false,
                totalPrice: 0,
                Quantity: 0
            };
            categories.push(category);
            Rates = null;
            Service = null;

        }


        /* Add price total to category total */
        category.totalPrice = parseFloat(category.totalPrice) + parseFloat(currItem.TotalPrice);
        category.totalPrice = category.totalPrice.toFixed(2);
        category.Quantity = parseFloat(category.Quantity) + parseFloat(currItem.Quantity);
        if (Rates !== currItem.Rates) {
            category.Rates = parseFloat(category.Rates) + parseFloat(1);
        }

        if (Service !== currItem.ServiceType) {
            category.ServiceTypes = parseFloat(category.ServiceTypes) + parseFloat(1);
        }


        /* Add item to category's items array */
        category.items.push(currItem);

        Rates = currItem.Rates;
        Service = currItem.ServiceType;

    }

    /* Update Vue data with new grouped dataset */
    $('#InternetDetail tfoot').hide();
    vBILLINGSUMMARY.InternetDetailCategories = categories;
}


function dsCustomerMailingAddress_onSuccess(data) {
    if (!HasData(data, "dsCustomerMailingAddress_onSuccess"))
        return;

    //vCUSTOMERHEADER.MailingAddressLine1 = data[0].MailingAddressLine1;
    //vCUSTOMERHEADER.MailingAddressCityStateZip = data[0].MailingAddressCityStateZip;
    for (var property in data[0]) {
        if (vCUSTOMERHEADER.MailingAddress.hasOwnProperty(property))
            vCUSTOMERHEADER.MailingAddress[property] = data[0][property];
    }
    /* Deep copy Mailing Address for 'reset' purposes */
    vCUSTOMERHEADER.OriginalMailingAddress = jQuery.extend(true, {}, vCUSTOMERHEADER.MailingAddress);

}


function GetCustomerCommunications_onSuccess(data) {
    $('#CustomerCommunications tfoot').hide();
    vCUSTOMERCOMMS.Rows = data;
    vCUSTOMERCOMMS.IsLoading = false;
}

function IsInternetTech_onSuccess(data) {
    for (var property in data[0]) {
        if (vCUSTOMERCOMMS.hasOwnProperty(property)) {
            vCUSTOMERCOMMS[property] = data[0][property];
        }
    }
}

function GetCustomerPortalDetails_onSuccess(data) {
    for (var property in data[0]) {
        if (vACCOUNTBALANCE.CustomerPortal.hasOwnProperty(property)) {
            vACCOUNTBALANCE.CustomerPortal[property] = data[0][property];
        }
    }
}

function Last5Payments_onSuccess(data) {
    if (!HasData(data, "Last5Payments_onSuccess"))
        return;
    vACCOUNTBALANCE.RecentPayments.Records = data;
}

function CustomerAnalysis_onSuccess(data) {
    vCUSTOMERANALYSIS.CustomerAnalysisRecords = data;
    vCUSTOMERANALYSIS.IsLoading = false;
}

function ActiveService_OnSuccess(data) {

    for (var property in data[0]) {
        if (vCUSTOMERHEADER.ActiveServices.hasOwnProperty(property))
            vCUSTOMERHEADER.ActiveServices[property] = data[0][property];
        if (vBILLINGSUMMARY.ActiveServices.hasOwnProperty(property))
            vBILLINGSUMMARY.ActiveServices[property] = data[0][property];
        if (vACCOUNTBALANCE.ActiveServices.hasOwnProperty(property))
            vACCOUNTBALANCE.ActiveServices[property] = data[0][property];
        
    }

    DataBindChartData(data);
}
function GetCableAndInternetData_OnSuccess(data) {    
    for (var property in data[0]) {
        if (vCONSUMPTIONCHARTS.hasOwnProperty(property))
            vCONSUMPTIONCHARTS[property] = data[0][property];
    }
}
function DataBindChartData(data) {
    if (!HasData(data, "DataBindChartData"))
        return;

    var HasElectric = data[0].Electric === '1';
    var HasGas = data[0].Gas === '1';
    var HasWater = data[0].Water === '1';
    var HasCableInternet = data[0].Cable === '1' || data[0].Internet === '1';

    var defaultChartSelect = '#ChartCableIcon';

    if (HasCableInternet) {
        $("#ChartCableIcon").show();
    }

    if (HasWater) {
        $("#ChartWaterIcon") .show();
        GetConsumptionData('water');
        $("#ChartWaterIcon").on("click", function () {
            //$("#electricChart").css("z-index", "100");
            //$("#gasChart").css("z-index", "100");
            //$("#waterChart").css("z-index", "200");
            $('.chart').css("z-index", "100");
            $("#waterChart").show();
            $('#CableInternetServices').hide();
        });
        defaultChartSelect = "#ChartWaterIcon";
    } else {
        $("#ChartWaterIcon")
            .hide()
            //.css("color", "#E0E0E0")
            //.removeClass('imgClickable')
            ;
    }
    if (HasGas) {
        $("#ChartGasIcon").show();
        GetConsumptionData('gas');
        $("#ChartGasIcon").on("click", function () {
            //$("#electricChart").css("z-index", "100");
            //$("#gasChart").css("z-index", "200");
            //$("#waterChart").css("z-index", "100");

            $('.chart').css("z-index", "100");
            $("#gasChart").css("z-index", "200");
            $('#CableInternetServices').hide();
        });
        defaultChartSelect = "#ChartGasIcon";

    } else {
        $("#ChartGasIcon")
            .hide();
            //.css("color", "#E0E0E0")
            //.removeClass('imgClickable');
    }
    if (HasElectric) {
        $("#ChartElectricIcon").show();
        GetConsumptionData('electric');
        $("#ChartElectricIcon").on("click", function () {
            //$("#electricChart").css("z-index", "200");
            //$("#gasChart").css("z-index", "100");
            //$("#waterChart").css("z-index", "100");

            $('.chart').css("z-index", "100");
            $("#electricChart").css("z-index", "200");
            $('#CableInternetServices').hide();
        });
        defaultChartSelect = "#ChartElectricIcon";
    } else {
        $("#ChartElectricIcon")
            .hide();
            //.css("color", "#E0E0E0")
            //.removeClass('imgClickable');
    }

    $(defaultChartSelect).click();
}

function ChartCableInternet_onclick() {
    $('#CableInternetServices').show().css("z-index", "200");
    $('.chart').css("z-index", "100");
}


function GetElectricChartData_OnSuccess(data) {
    var electricCurrentYearUsage = data.map(function (obj) {
        return parseFloat(obj.CurrYearConsumption);
    });
    var electricLastYearUsage = data.map(function (obj) {
        return parseFloat(obj.LastYearConsumption);
    });

    var electricDateCategories = data.map(function (obj) {
        return moment(obj.Category).format("MMM YY");
    });

    $('#electricChart').highcharts({
        chart: {
            type: 'column'
        },
        colors: ['#ffe0aa', '#ffba42'],

        credits: {
            enabled: false
        },
        title: {
            align: 'left',
            text: 'Billed Consumption - Electric'
        },
        xAxis: {
            categories: electricDateCategories
        },
        yAxis: {
            title: {
                text: 'kWh'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' kWh'
        },
        legend: {
            layout: 'horizontal',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: [
            {
                name: 'Last Year',
                data: electricLastYearUsage
            },
            {
                name: 'Current Year',
                data: electricCurrentYearUsage
            }
        ]
    });
}

function GetGasChartData_OnSuccess(data) {

    var gasCurrentYearUsage = data.map(function (obj) {
        return parseFloat(obj.CurrYearConsumption);
    });
    var gasLastYearUsage = data.map(function (obj) {
        return parseFloat(obj.LastYearConsumption);
    });

    var gasDateCategories = data.map(function (obj) {
        return moment(obj.Category).format("MMM YY");
    });

    $('#gasChart').highcharts({
        chart: {
            type: 'column'
        },
        colors: ['#f3b1b3', '#da4949'],

        credits: {
            enabled: false
        },
        title: {
            align: 'left',
            text: 'Billed Consumption - Gas'
        },
        xAxis: {
            categories: gasDateCategories
        },
        yAxis: {
            title: {
                text: 'CCF'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' CCF'
        },
        legend: {
            layout: 'horizontal',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: [
            {
                name: 'Last Year',
                data: gasLastYearUsage
            },
            {
                name: 'Current Year',
                data: gasCurrentYearUsage
            }
        ]
    });
}

function GetWaterChartData_OnSuccess(data) {
    var waterCurrentYearUsage = data.map(function (obj) {
        return parseFloat(obj.CurrYearConsumption);
    });
    var waterLastYearUsage = data.map(function (obj) {
        return parseFloat(obj.LastYearConsumption);
    });

    var waterDateCategories = data.map(function (obj) {
        return moment(obj.Category).format("MMM YY");
    });

    $('#waterChart').highcharts({
        chart: {
            type: 'column'
        },
        colors: ['#b5d2fd', '#508bed'],

        credits: {
            enabled: false
        },
        title: {
            align: 'left',
            text: 'Billed Consumption - Water'
        },
        xAxis: {
            categories: waterDateCategories
        },
        yAxis: {
            title: {
                text: 'Gal x 100'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' (Gal x 100)'
        },
        legend: {
            layout: 'horizontal',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: [
            {
                name: 'Last Year',
                data: waterLastYearUsage
            },
            {
                name: 'Current Year',
                data: waterCurrentYearUsage
            }
        ]
    });

}      

function ElectricConnections_onSuccess(data) {
    vBILLINGSUMMARY.Electric.Connections = data;
}
function ElectricMiscCharges_onSuccess(data) {
    vBILLINGSUMMARY.Electric.MiscCharges = data;
}
function WaterConnections_onSuccess(data) {
    vBILLINGSUMMARY.Water.Connections = data;
}
function WaterMiscCharges_onSuccess(data) {
    vBILLINGSUMMARY.Water.MiscCharges = data;
}

function GasConnections_onSuccess(data) {
    vBILLINGSUMMARY.Gas.Connections = data;
}
function GasMiscCharges_onSuccess(data) {
    vBILLINGSUMMARY.Gas.MiscCharges = data;
}
function CableConnections_onSuccess(data) {
    vBILLINGSUMMARY.Cable.Connections = data;
}
function CableMiscCharges_onSuccess(data) {
    vBILLINGSUMMARY.Cable.MiscCharges = data;
}
function InternetConnections_onSuccess(data) {
    vBILLINGSUMMARY.Internet.Connections = data;
}
function InternetMiscCharges_onSuccess(data) {
    vBILLINGSUMMARY.Internet.MiscCharges = data;
}
function EquipmentDetail_onSuccess(data) {
    if (!HasData(data, "EquipmentDetail_onSuccess"))
        return;
    vBILLINGSUMMARY.Cable.Equipment = data;
    vBILLINGSUMMARY.Internet.Equipment = data;
}

function CommandBridge_onSuccess(data) {
    vBILLINGSUMMARY.Cable.CableBridgeCommands = data;
}

function EmailAddresses_onSuccess(data) {
    vBILLINGSUMMARY.Internet.EmailAddresses = data;

}

/* Update Ajax functions */
function UpdateContactInfo(newMailingAddressObj, newPhoneNumbersObj, newEmail) {
    newMailingAddressObj.CustNbr = CUSTOMER;
    newMailingAddressObj.Phone1 = newPhoneNumbersObj.Phone1;
    newMailingAddressObj.Phone2 = newPhoneNumbersObj.Phone2;
    newMailingAddressObj.Phone3 = newPhoneNumbersObj.Phone3;
    newMailingAddressObj.Phone1Type = newPhoneNumbersObj.Phone1Type;
    newMailingAddressObj.Phone2Type = newPhoneNumbersObj.Phone2Type;
    newMailingAddressObj.Phone3Type = newPhoneNumbersObj.Phone3Type;
    newMailingAddressObj.Email = newEmail;

    return $.ajax({
        url: "CustomerPage.aspx/UpdateContactInfo"
        , type: 'POST'
        , contentType: "application/json; charset=utf-8"
        , dataType: 'json'
        , data: JSON.stringify({
            requestObj: newMailingAddressObj
        })
    });
}

function SendCableResetCommand(input) {
    vACCOUNTBALANCE.CableReset.IsSending = true;
    vACCOUNTBALANCE.CableReset.Response = "Sending Cable Reset Command...";

    $.ajax({
        url: "CustomerPage.aspx/SendAccountReset"
        , type: 'POST'
        , contentType: "application/json; charset=utf-8"
        , data: JSON.stringify({
            input: input
        })
        , error: function (data) {
            vACCOUNTBALANCE.CableReset.IsSending = false;
            vACCOUNTBALANCE.CableReset.ResponseLabelColor = 'red';
            vACCOUNTBALANCE.CableReset.Response = "Server Error";
        }
        , success: function (result) {
            vACCOUNTBALANCE.CableReset.IsSending = false;
            vACCOUNTBALANCE.CableReset.ResponseLabelColor = 'green';
            vACCOUNTBALANCE.CableReset.Response = "Cable Reset Command sent successfully!";
            GetCableBridgeDetail();
        }

    });
}

/* Utility functions */

function InitStreetTypeTypeahead() {
    var streetType = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '../data/streetTypes.json'
    });

    $('#contact_StreetType').typeahead(null, {
        name: 'StreetType',
        source: streetType
    });
}

function HasData(data, func) {
    if (data.length === 0) {
        console.log(func + " received no data");
        return false;
    }
    else
        return true;
}

function FormatCurrency(value) {
    return parseFloat(value.toString()).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}
/* Dynamic styling based on account and billing summary totals */
function ApplyBillingSummaryStyle(size) {
    $('#BillingSummary').find('.fontResizable').attr("class", "fontResizable " + size);
}

function ApplyAccountBalanceStyle(size) {
    $('#AccountBalance').find('.fontResizable').attr("class", "fontResizable " + size);
}

/* Used by Customer Communications for integration links */
function GetPopUpURL(URL) {
    return "javascript:void(window.open('" + URL + "', '', '" + popupSettings + "'))";
}

/* Used by Billing Summary for calculating most dates */
function FindMostRecentRecord (Records) {
    var SQLDateFormat = 'YYYY-MM-DD HH:mm:ss';
    var mostRecent = moment();
    if (Records.length > 1) {
        mostRecent = moment(Records[0].MostRecentBillingDate, SQLDateFormat);
        Records.forEach(
            function (record) {
                var thisDate = moment(record.MostRecentBillingDate, SQLDateFormat);
                if (thisDate.isAfter(mostRecent))
                    mostRecent = thisDate;
            }
        );
    } else if (Records.length === 1) {
        mostRecent = moment(Records[0].MostRecentBillingDate, SQLDateFormat);
    }
    return mostRecent;
}
