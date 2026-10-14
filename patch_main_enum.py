import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_logic = """    # Calculate end date based on plan
    end_date = datetime.utcnow()
    if req.plan_type == "1 Month": end_date += timedelta(days=30)
    elif req.plan_type == "3 Months": end_date += timedelta(days=90)
    elif req.plan_type == "6 Months": end_date += timedelta(days=180)
    elif req.plan_type == "1 Year": end_date += timedelta(days=365)
    
    # Create Store (PENDING)
    new_store = models.Store(
        name=req.store_name,
        owner_name=req.owner_name,
        mobile=req.mobile,
        address=req.address,
        status=models.StoreStatusEnum.PENDING,
        plan_type=req.plan_type,
        subscription_end_date=end_date
    )"""

new_logic = """    # Calculate end date based on plan
    end_date = datetime.utcnow()
    enum_plan = models.PlanTypeEnum.MONTH_1
    if req.plan_type == "1 Month": 
        end_date += timedelta(days=30)
        enum_plan = models.PlanTypeEnum.MONTH_1
    elif req.plan_type == "3 Months": 
        end_date += timedelta(days=90)
        enum_plan = models.PlanTypeEnum.MONTH_3
    elif req.plan_type == "6 Months": 
        end_date += timedelta(days=180)
        enum_plan = models.PlanTypeEnum.MONTH_6
    elif req.plan_type == "1 Year": 
        end_date += timedelta(days=365)
        enum_plan = models.PlanTypeEnum.YEAR_1
    
    # Create Store (PENDING)
    new_store = models.Store(
        name=req.store_name,
        owner_name=req.owner_name,
        mobile=req.mobile,
        address=req.address,
        status=models.StoreStatusEnum.PENDING,
        plan_type=enum_plan,
        subscription_end_date=end_date
    )"""

text = text.replace(old_logic, new_logic)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Backend/main.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("main.py plan_type patched.")
