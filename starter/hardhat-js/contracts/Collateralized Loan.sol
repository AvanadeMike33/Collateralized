// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


// Collateralized Loan Contract
contract CollateralizedLoan {
    // Define the structure of a loan
    struct Loan {
        address payable borrower;
        address payable lender;
        uint collateralAmount;
        uint loanAmount;
        uint interestRate;
        uint dueDate;
        bool isFunded;
        bool isRepaid;
    }

    // Create a mapping to manage the loans
    mapping(uint => Loan) public loans;
    uint public nextLoanId;
    // Hint: Define events for loan requested, funded, repaid, and collateral claimed

    // Custom Modifiers
    // Hint: Write a modifier to check if a loan exists
    // Hint: Write a modifier to ensure a loan is not already funded
    
    bool private locked;

    event LoanRequested(
        uint indexed loanId,
        address indexed borrower,
        uint collateralAmount,
        uint loanAmount,
        uint interestRate,
        uint duration
    );

    event LoanFunded(
        uint indexed loanId,
        address indexed lender,
        uint loanAmount,
        uint dueDate
    );

    event LoanRepaid(
        uint indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint repaymentAmount
    );

    event CollateralClaimed(
        uint indexed loanId,
        address indexed lender,
        uint collateralAmount
    );

    modifier loanExists(uint _loanId) {
        require(_loanId < nextLoanId, "Loan does not exist");
        _;
    }

    modifier notFunded(uint _loanId) {
        require(!loans[_loanId].isFunded, "Loan is already funded");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function depositCollateralAndRequestLoan(
        uint _interestRate,
        uint _duration
    ) external payable {
        require(msg.value > 0, "Collateral must be greater than zero");
        require(_duration > 0, "Duration must be greater than zero");
        require(
            _interestRate <= 10_000,
            "Interest rate cannot exceed 100 percent"
        );

     
        uint calculatedLoanAmount = msg.value / 2;

        require(
            calculatedLoanAmount > 0,
            "Collateral is too small"
        );

        uint loanId = nextLoanId;
        nextLoanId++;

        loans[loanId] = Loan({
            borrower: payable(msg.sender),
            lender: payable(address(0)),
            collateralAmount: msg.value,
            loanAmount: calculatedLoanAmount,
            interestRate: _interestRate,
            dueDate: block.timestamp + _duration,
            isFunded: false,
            isRepaid: false
        });

        emit LoanRequested(
            loanId,
            msg.sender,
            msg.value,
            calculatedLoanAmount,
            _interestRate,
            _duration
        );
    }

    // Function to fund a loan
    function fundLoan(
        uint _loanId
    )
        external
        payable
        loanExists(_loanId)
        notFunded(_loanId)
        nonReentrant
    {
        Loan storage loan = loans[_loanId];

        require(
            msg.sender != loan.borrower,
            "Borrower cannot fund own loan"
        );

        require(
            msg.value == loan.loanAmount,
            "Incorrect funding amount"
        );

       
        loan.lender = payable(msg.sender);
        loan.isFunded = true;

        (bool success, ) = loan.borrower.call{
            value: loan.loanAmount
        }("");

        require(success, "Loan transfer failed");

        emit LoanFunded(
            _loanId,
            msg.sender,
            loan.loanAmount,
            loan.dueDate
        );
    }

    // Function to repay a loan
    function repayLoan(
        uint _loanId
    )
        external
        payable
        loanExists(_loanId)
        nonReentrant
    {
        Loan storage loan = loans[_loanId];

        require(
            msg.sender == loan.borrower,
            "Only borrower can repay"
        );

        require(loan.isFunded, "Loan is not funded");
        require(!loan.isRepaid, "Loan is already repaid");
        require(
            block.timestamp <= loan.dueDate,
            "Loan is past due"
        );

        uint interest =
            (loan.loanAmount * loan.interestRate) / 10_000;

        uint repaymentAmount =
            loan.loanAmount + interest;

        require(
            msg.value == repaymentAmount,
            "Incorrect repayment amount"
        );

        uint collateralToReturn = loan.collateralAmount;

      
        loan.isRepaid = true;
        loan.collateralAmount = 0;

        (bool lenderPaid, ) = loan.lender.call{
            value: repaymentAmount
        }("");

        require(lenderPaid, "Lender payment failed");

        (bool collateralReturned, ) = loan.borrower.call{
            value: collateralToReturn
        }("");

        require(
            collateralReturned,
            "Collateral return failed"
        );

        emit LoanRepaid(
            _loanId,
            loan.borrower,
            loan.lender,
            repaymentAmount
        );
    }

    // Function to claim collateral on default
    function claimCollateral(
        uint _loanId
    )
        external
        loanExists(_loanId)
        nonReentrant
    {
        Loan storage loan = loans[_loanId];

        require(
            msg.sender == loan.lender,
            "Only lender can claim collateral"
        );

        require(loan.isFunded, "Loan is not funded");
        require(!loan.isRepaid, "Loan was repaid");
        require(
            block.timestamp > loan.dueDate,
            "Loan is not past due"
        );

        uint collateralToClaim = loan.collateralAmount;

        require(
            collateralToClaim > 0,
            "Collateral already claimed"
        );

       
        loan.collateralAmount = 0;

        (bool success, ) = loan.lender.call{
            value: collateralToClaim
        }("");

        require(success, "Collateral transfer failed");

        emit CollateralClaimed(
            _loanId,
            loan.lender,
            collateralToClaim
        );
    }

    
    function getRepaymentAmount(
        uint _loanId
    )
        external
        view
        loanExists(_loanId)
        returns (uint)
    {
        Loan storage loan = loans[_loanId];

        uint interest =
            (loan.loanAmount * loan.interestRate) / 10_000;

        return loan.loanAmount + interest;
    }
}